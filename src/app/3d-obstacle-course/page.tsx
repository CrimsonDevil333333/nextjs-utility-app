'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Volume2, VolumeX, Shield } from 'lucide-react';
import * as Tone from 'tone';

const ObstacleCourseGame = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'over'>('start');
    const [difficulty, setDifficulty] = useState<'easy'>('easy');
    const [isMuted, setIsMuted] = useState(false);
    const [hasShield, setHasShield] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const gameRef = useRef({
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(75, 1, 0.1, 1000),
        renderer: null as THREE.WebGLRenderer | null,
        player: new THREE.Mesh(),
        obstacles: [] as THREE.Mesh[],
        powerUps: [] as THREE.Mesh[],
        floor: new THREE.Mesh(),
        gameSpeed: 0.1,
        targetX: 0,
        animationFrameId: 0,
        synths: {} as { crash?: Tone.Synth, powerup?: Tone.Synth },
        score: 0,
        moveDirection: 0, // -1 for left, 1 for right
    });

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const initAudio = useCallback(() => {
        const game = gameRef.current;
        if (!game.synths.crash) {
            game.synths.crash = new Tone.Synth({ oscillator: { type: 'fatsquare' }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.4 } }).toDestination();
            game.synths.powerup = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 } }).toDestination();
        }
    }, []);

    const resetGame = useCallback(() => {
        const game = gameRef.current;
        setScore(0);
        game.score = 0;
        const speeds = { easy: 0.08, medium: 0.1, hard: 0.13 };
        game.gameSpeed = speeds[difficulty];
        game.player.position.set(0, 0.5, 0);
        [...game.obstacles, ...game.powerUps].forEach(o => game.scene.remove(o));
        game.obstacles = [];
        game.powerUps = [];
        setHasShield(false);
        setGameState('start');
    }, [difficulty]);

    const startGame = () => {
        triggerHapticFeedback();
        if (navigator.vibrate) navigator.vibrate(50);
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
        resetGame();
        setGameState('playing');
    };

    useEffect(() => {
        const game = gameRef.current;
        const mount = mountRef.current;
        if (!mount || game.renderer) return;

        initAudio();
        game.renderer = new THREE.WebGLRenderer({ antialias: true });
        game.camera.aspect = window.innerWidth / window.innerHeight;
        game.camera.updateProjectionMatrix();
        game.renderer.setSize(window.innerWidth, window.innerHeight);
        game.renderer.shadowMap.enabled = true;
        mount.appendChild(game.renderer.domElement);
        game.scene.background = new THREE.Color(0x111827);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        light.castShadow = true;
        game.scene.add(light);
        game.scene.add(new THREE.AmbientLight(0x404040, 2));

        const floorGeometry = new THREE.PlaneGeometry(30, 200);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x4A5568 });
        game.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        game.floor.rotation.x = -Math.PI / 2;
        game.floor.receiveShadow = true;
        game.scene.add(game.floor);

        const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
        const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x4299E1 });
        game.player = new THREE.Mesh(playerGeometry, playerMaterial);
        game.player.position.y = 0.5;
        game.player.castShadow = true;
        game.scene.add(game.player);

        game.camera.position.set(0, 5, 10);
        game.camera.lookAt(game.player.position);

        setHighScore(parseInt(localStorage.getItem('3dObstacleHighScore') || '0', 10));
        resetGame();

        const onWindowResize = () => {
            if (game.renderer) {
                game.camera.aspect = window.innerWidth / window.innerHeight;
                game.camera.updateProjectionMatrix();
                game.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (mount && game.renderer) {
                mount.removeChild(game.renderer.domElement);
            }
            cancelAnimationFrame(game.animationFrameId);
        };
    }, [resetGame, initAudio]);

    useEffect(() => {
        const game = gameRef.current;
        
        const animate = () => {
            if (gameRef.current.animationFrameId === -1) return;
            game.animationFrameId = requestAnimationFrame(animate);

            if (isTouchDevice) {
                const playerSpeed = 0.2;
                let newX = game.player.position.x + game.moveDirection * playerSpeed;
                newX = Math.max(-9.5, Math.min(9.5, newX));
                game.player.position.x = newX;
            } else {
                game.player.position.x += (game.targetX - game.player.position.x) * 0.1;
            }
            
            game.player.position.z -= game.gameSpeed;

            if (Math.random() < 0.05) {
                const isPowerUp = Math.random() < 0.2;
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = isPowerUp 
                    ? new THREE.MeshStandardMaterial({ color: Math.random() < 0.5 ? 0x34D399 : 0x60A5FA })
                    : new THREE.MeshStandardMaterial({ color: 0xE53E3E });
                const object = new THREE.Mesh(geometry, material);
                object.position.set(Math.random() * 20 - 10, 0.5, game.player.position.z - 50);
                
                if(isPowerUp) {
                    object.userData.type = material.color.getHexString() === '34d399' ? 'speed' : 'shield';
                    game.powerUps.push(object);
                } else {
                    game.obstacles.push(object);
                }
                game.scene.add(object);
            }

            game.obstacles.forEach((obstacle, index) => {
                if (obstacle.position.z > game.player.position.z + 10) {
                    game.scene.remove(obstacle);
                    game.obstacles.splice(index, 1);
                }
                if (new THREE.Box3().setFromObject(game.player).intersectsBox(new THREE.Box3().setFromObject(obstacle))) {
                    if (hasShield) {
                        setHasShield(false);
                        game.scene.remove(obstacle);
                        game.obstacles.splice(index, 1);
                    } else {
                        if (navigator.vibrate) navigator.vibrate(200);
                        game.synths.crash?.triggerAttackRelease('C2', '0.5s');
                        setGameState('over');
                        const currentHighScore = parseInt(localStorage.getItem('3dObstacleHighScore') || '0', 10);
                        if (game.score > currentHighScore) {
                            setHighScore(game.score);
                            localStorage.setItem('3dObstacleHighScore', String(game.score));
                        }
                    }
                }
            });
            
            game.powerUps.forEach((powerUp, index) => {
                if (powerUp.position.z > game.player.position.z + 10) {
                    game.scene.remove(powerUp);
                    game.powerUps.splice(index, 1);
                }
                if (new THREE.Box3().setFromObject(game.player).intersectsBox(new THREE.Box3().setFromObject(powerUp))) {
                    game.synths.powerup?.triggerAttackRelease('G4', '0.2s');
                    if (powerUp.userData.type === 'shield') setHasShield(true);
                    if (powerUp.userData.type === 'speed') game.gameSpeed *= 1.2;
                    game.scene.remove(powerUp);
                    game.powerUps.splice(index, 1);
                }
            });

            game.gameSpeed += 0.0001;
            game.score += Math.floor(game.gameSpeed * 10);
            
            game.camera.position.z = game.player.position.z + 10;
            game.floor.position.z = game.player.position.z - 90;
            (game.player.material as THREE.MeshStandardMaterial).color.set(hasShield ? 0x60A5FA : 0x4299E1);

            if (game.renderer) game.renderer.render(game.scene, game.camera);
        };

        if (gameState === 'playing') {
            const scoreUpdateInterval = setInterval(() => setScore(game.score), 100);
            animate();
            return () => {
                cancelAnimationFrame(game.animationFrameId);
                clearInterval(scoreUpdateInterval);
            };
        }
    }, [gameState, hasShield, isTouchDevice]);

    const handlePointerMove = (clientX: number) => {
        if (!isTouchDevice) {
            gameRef.current.targetX = (clientX / window.innerWidth - 0.5) * 20;
        }
    };

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handlePointerMove(e.clientX);
        window.addEventListener('mousemove', moveHandler);
        return () => window.removeEventListener('mousemove', moveHandler);
    }, [isTouchDevice]);
    
    useEffect(() => {
        Tone.Master.mute = isMuted;
    }, [isMuted]);

    return (
        <div className="relative w-screen h-screen">
            <div ref={mountRef} />
            <div id="ui-container" className="absolute inset-0 flex flex-col items-center justify-between p-4 sm:p-8 pointer-events-none text-white">
                <div className="w-full flex justify-between text-lg sm:text-xl font-bold">
                    <div className="bg-black/50 px-4 py-2 rounded-lg">Score: {score}</div>
                    <div className="flex items-center gap-4">
                        {hasShield && <Shield className="text-blue-400 animate-pulse" />}
                        <div className="bg-black/50 px-4 py-2 rounded-lg">High Score: {highScore}</div>
                    </div>
                </div>
                {gameState !== 'playing' && (
                    <div id="game-message" className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center pointer-events-auto">
                        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">{gameState === 'start' ? '3D Obstacle Course' : 'Game Over'}</h2>
                        <p className="text-xl sm:text-2xl mb-6">{gameState === 'start' ? 'Dodge the red blocks!' : `Your Score: ${score}`}</p>
                        {gameState === 'start' && (
                            <div className="mb-6">
                                <label className="block mb-2">Difficulty</label>
                                <div className="flex gap-2 bg-gray-700 p-1 rounded-full">
                                    <button onClick={() => setDifficulty('easy')} className={`px-4 py-2 rounded-full ${difficulty === 'easy' ? 'bg-blue-600' : ''}`}>Easy</button>
                                </div>
                            </div>
                        )}
                        <button onClick={gameState === 'start' ? startGame : resetGame} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-xl shadow-lg">
                            {gameState === 'start' ? 'Start Game' : 'Play Again'}
                        </button>
                    </div>
                )}
                <div className="w-full flex justify-between items-end">
                    {isTouchDevice && gameState === 'playing' && (
                        <div className="flex gap-4 pointer-events-auto">
                            <button onTouchStart={() => gameRef.current.moveDirection = -1} onTouchEnd={() => gameRef.current.moveDirection = 0} className="w-20 h-20 bg-black/50 rounded-full text-4xl text-white active:bg-blue-500">←</button>
                            <button onTouchStart={() => gameRef.current.moveDirection = 1} onTouchEnd={() => gameRef.current.moveDirection = 0} className="w-20 h-20 bg-black/50 rounded-full text-4xl text-white active:bg-blue-500">→</button>
                        </div>
                    )}
                    <div className="flex-grow"></div>
                    <button onClick={() => setIsMuted(!isMuted)} className="ui-element p-3 bg-black/50 rounded-full pointer-events-auto">
                        {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObstacleCourseGame;

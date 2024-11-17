import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { Camera, CameraOff } from 'lucide-react';

export const HandDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [fingerCount, setFingerCount] = useState(0);
  const [model, setModel] = useState<handpose.HandPose | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await handpose.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const countExtendedFingers = (landmarks: number[][]) => {
    // Get fingertip and middle knuckle positions for each finger
    const fingerTips = [4, 8, 12, 16, 20]; // Indices for fingertips
    const middleKnuckles = [2, 6, 10, 14, 18]; // Indices for middle knuckles
    
    let count = 0;
    
    // Check each finger
    for (let i = 0; i < 5; i++) {
      const tipY = landmarks[fingerTips[i]][1];
      const knuckleY = landmarks[middleKnuckles[i]][1];
      
      // A finger is considered extended if its tip is higher (lower Y value) than its middle knuckle
      // For thumb, we use a different calculation due to its sideways position
      if (i === 0) { // Thumb
        const tipX = landmarks[fingerTips[i]][0];
        const knuckleX = landmarks[middleKnuckles[i]][0];
        if (Math.abs(tipX - knuckleX) > 30) {
          count++;
        }
      } else if (knuckleY - tipY > 30) { // Other fingers
        count++;
      }
    }
    
    return count;
  };

  const drawHand = (predictions: handpose.AnnotatedPrediction[], ctx: CanvasRenderingContext2D) => {
    predictions.forEach(prediction => {
      // Draw landmarks
      prediction.landmarks.forEach((landmark, index) => {
        const [x, y] = landmark;

        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw connections
        if (index > 0) {
          const [px, py] = prediction.landmarks[index - 1];
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });

      // Count fingers and update state
      const count = countExtendedFingers(prediction.landmarks);
      setFingerCount(count);
    });
  };

  const detectHands = async () => {
    if (!model || !webcamRef.current || !canvasRef.current || !isWebcamOn) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;

    if (video && video.readyState === 4) {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, videoWidth, videoHeight);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

      const predictions = await model.estimateHands(video);
      if (predictions.length > 0) {
        drawHand(predictions, ctx);
      } else {
        setFingerCount(0);
      }
    }
  };

  useEffect(() => {
    if (isWebcamOn) {
      const interval = setInterval(() => {
        detectHands();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [model, isWebcamOn]);

  const toggleWebcam = () => {
    setIsWebcamOn(!isWebcamOn);
  };

  return (
    <div className="relative">
      <div className="relative aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl">
        {isWebcamOn && (
          <Webcam
            ref={webcamRef}
            mirrored
            className="w-full h-full object-cover"
          />
        )}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        {!isWebcamOn && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <p className="text-white text-xl">Camera is off</p>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 flex flex-col items-end gap-4">
        <button
          onClick={toggleWebcam}
          className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
        >
          {isWebcamOn ? (
            <CameraOff className="w-6 h-6 text-gray-900" />
          ) : (
            <Camera className="w-6 h-6 text-gray-900" />
          )}
        </button>
        
        {isWebcamOn && (
          <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg">
            <p className="font-medium">
              Fingers detected: <span className="text-emerald-600">{fingerCount}</span>
            </p>
          </div>
        )}
      </div>

      {fingerCount > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg text-xl font-bold">
            You are showing {fingerCount} {fingerCount === 1 ? 'finger' : 'fingers'}!
          </div>
        </div>
      )}
    </div>
  );
};
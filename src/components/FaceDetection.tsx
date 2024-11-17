import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { Camera, CameraOff } from 'lucide-react';

export const FaceDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [faceCount, setFaceCount] = useState(0);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const drawFaces = (predictions: blazeface.NormalizedFace[], ctx: CanvasRenderingContext2D) => {
    predictions.forEach(prediction => {
      const start = prediction.topLeft as [number, number];
      const end = prediction.bottomRight as [number, number];
      const size = [end[0] - start[0], end[1] - start[1]];

      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(start[0], start[1], size[0], size[1]);

      // Draw landmarks
      prediction.landmarks.forEach((landmark: number[]) => {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(landmark[0], landmark[1], 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  const detectFaces = async () => {
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

      const predictions = await model.estimateFaces(video, false);
      setFaceCount(predictions.length);
      drawFaces(predictions, ctx);
    }
  };

  useEffect(() => {
    if (isWebcamOn) {
      const interval = setInterval(() => {
        detectFaces();
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
              Faces detected: <span className="text-indigo-600">{faceCount}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
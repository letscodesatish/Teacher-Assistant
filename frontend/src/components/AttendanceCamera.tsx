'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon, MapPin, RefreshCcw, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

interface Location {
    lat: number;
    lng: number;
}

interface MatchInfo {
    status: string;
    [key: string]: any;
}

const AttendanceCamera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<'idle' | 'capturing' | 'matching' | 'success' | 'fail'>('idle');
    const [location, setLocation] = useState<Location | null>(null);
    const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
            .catch(err => console.error("Camera access denied:", err));

        navigator.geolocation.getCurrentPosition(
            (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.error("GPS access denied:", err)
        );
    }, []);

    const captureAndScan = async () => {
        if (!videoRef.current || !canvasRef.current || !location) return;

        setStatus('matching');
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
        }

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const formData = new FormData();
            formData.append('image', blob, 'scan.jpg');
            formData.append('lat', location.lat.toString());
            formData.append('lng', location.lng.toString());

            try {
                const res = await axios.post('http://localhost:8999/attendance/scan', formData);
                if (res.data.status === 'success') {
                    setStatus('success');
                    setMatchInfo(res.data);
                } else {
                    setStatus('fail');
                    setMatchInfo(res.data);
                }
            } catch (err) {
                console.error("Scan error:", err);
                setStatus('fail');
            }
        }, 'image/jpeg');
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            <div className="card p-0 overflow-hidden relative border-[12px] border-white shadow-2xl rounded-[40px] bg-slate-100">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-[450px] object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay Scanning UI */}
                <div className="absolute inset-0 flex items-center justify-center p-16 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-white/30 rounded-[60px] relative">
                         <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-white rounded-tl-[60px]" />
                         <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-white rounded-tr-[60px]" />
                         <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-white rounded-bl-[60px]" />
                         <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-white rounded-br-[60px]" />
                    </div>
                </div>

                {status === 'matching' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <RefreshCcw className="animate-spin text-white opacity-20" size={120} />
                                <CameraIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" size={40} />
                            </div>
                            <div className="text-center">
                                <span className="font-black text-white tracking-[0.2em] uppercase text-sm block mb-1">Authenticating</span>
                                <span className="text-white/60 text-[10px] font-bold uppercase">Biometric & GPS Validation</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info and Actions */}
            <div className="flex flex-col gap-4 px-2">
                <div className="flex items-center justify-between card py-4 px-6 border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${location ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Location</p>
                            <p className="text-xs font-bold text-slate-700">
                                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Acquiring GPS Signal..."}
                            </p>
                        </div>
                    </div>
                    {location && (
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Encrypted</span>
                        </div>
                    )}
                </div>

                {status === 'idle' ? (
                    <button 
                        onClick={captureAndScan}
                        disabled={!location}
                        className="w-full bg-active hover:opacity-90 disabled:opacity-30 text-white font-black py-6 rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl hover:shadow-black/20"
                    >
                        <CameraIcon size={24} /> 
                        <span className="tracking-widest uppercase text-sm">Initiate Identity Scan</span>
                    </button>
                ) : status === 'success' ? (
                    <div className="card border-none bg-green-600 p-6 flex items-center justify-between rounded-[32px] shadow-xl shadow-green-200 animate-in zoom-in duration-500">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                 <CheckCircle2 className="text-white" size={32} />
                            </div>
                            <div>
                                <p className="font-black text-white text-lg leading-tight uppercase tracking-tight">Identity Verified</p>
                                <div className="flex items-center gap-2 text-white/80 font-bold text-xs mt-1">
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">ID: {matchInfo?.student_id}</span>
                                    {matchInfo?.geofenced ? (
                                        <span className="bg-green-400/30 px-2 py-0.5 rounded text-[10px] text-green-100">On Campus</span>
                                    ) : (
                                        <span className="bg-orange-400/30 px-2 py-0.5 rounded text-[10px] text-orange-100">Off Campus</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setStatus('idle')} className="text-white/60 hover:text-white transition-colors">
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="card border-none bg-rose-600 p-6 flex items-center justify-between rounded-[32px] shadow-xl shadow-rose-200 animate-in zoom-in duration-500">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                 <XCircle className="text-white" size={32} />
                            </div>
                            <div>
                                <p className="font-black text-white text-lg leading-tight uppercase tracking-tight">Verification Failed</p>
                                <p className="text-xs text-white/70 font-bold mt-1 uppercase tracking-wider">Biometric Mismatch Detected</p>
                            </div>
                        </div>
                        <button onClick={() => setStatus('idle')} className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl text-white transition-all active:scale-90 border border-white/20">
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceCamera;

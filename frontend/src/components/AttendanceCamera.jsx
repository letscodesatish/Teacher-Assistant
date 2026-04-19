import React, { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon, MapPin, RefreshCcw, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AttendanceCamera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle, capturing, matching, success, fail
    const [location, setLocation] = useState(null);
    const [matchInfo, setMatchInfo] = useState(null);

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
        if (!videoRef.current || !location) return;

        setStatus('matching');
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('image', blob, 'scan.jpg');
            formData.append('lat', location.lat);
            formData.append('lng', location.lng);

            try {
                const res = await axios.post('http://localhost:8005/attendance/scan', formData);
                if (res.data.status === 'success') {
                    setStatus('success');
                    setMatchInfo(res.data);
                } else {
                    setStatus('fail');
                }
            } catch (err) {
                console.error("Scan error:", err);
                setStatus('fail');
            }
        }, 'image/jpeg');
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <header className="mb-2">
                <h2 className="text-2xl font-black">Scan Classroom</h2>
                <p className="text-sm text-slate-500 font-medium lowercase">Face recognition and geofencing verification</p>
            </header>

            <div className="card p-0 overflow-hidden relative border-4 border-white shadow-xl">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-[400px] object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay Scanning UI */}
                <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-white/40 rounded-[48px] relative">
                         <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-white rounded-tl-[48px]" />
                         <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-white rounded-tr-[48px]" />
                         <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-white rounded-bl-[48px]" />
                         <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-white rounded-br-[48px]" />
                    </div>
                </div>

                {status === 'matching' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCcw className="animate-spin text-white" size={48} />
                            <span className="font-extrabold text-white tracking-widest uppercase text-sm">Validating Identity...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Info and Actions */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between card py-3 px-5 border-none shadow-sm">
                    <div className="flex items-center gap-3">
                        <MapPin size={18} className={location ? "text-green-600" : "text-slate-300"} />
                        <span className="text-xs font-bold text-slate-600">
                            {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Acquiring GPS..."}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Security Verified</span>
                    </div>
                </div>

                {status === 'idle' || status === 'fail' ? (
                    <button 
                        onClick={captureAndScan}
                        disabled={!location}
                        className="w-full bg-active hover:opacity-90 disabled:opacity-30 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                        <CameraIcon size={20} /> MARK ATTENDANCE
                    </button>
                ) : status === 'success' ? (
                    <div className="card border-none bg-[#dcfce7] p-5 flex items-center gap-4 animate-in zoom-in duration-300">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                             <CheckCircle2 className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="font-black text-green-900 leading-tight">Identity Verified</p>
                            <p className="text-xs text-green-700 font-medium">Record pushed to academic database</p>
                        </div>
                    </div>
                ) : (
                    <div className="card border-none bg-red-50 p-5 flex items-center gap-4 animate-in zoom-in duration-300">
                         <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                             <XCircle className="text-red-500" size={24} />
                        </div>
                        <div>
                            <p className="font-black text-red-900 leading-tight">Recognition Failed</p>
                            <p className="text-xs text-red-700 font-medium">Please ensure face is clear and try again</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceCamera;

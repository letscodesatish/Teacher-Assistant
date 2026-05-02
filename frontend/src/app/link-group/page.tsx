'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Link as LinkIcon, RefreshCcw, Check, AlertCircle } from 'lucide-react';

interface WhatsAppGroup {
    id: string;
    name: string;
}

interface Subject {
    id: number;
    subject: string;
}

interface GroupLink {
    className: string;
    subjectCode: string;
    whatsappGroupId: string;
    isLinked: boolean;
}

export default function LinkWhatsAppGroup() {
    const [subjects, setSubjects] = useState<string[]>([]);
    const [whatsappGroups, setWhatsappGroups] = useState<WhatsAppGroup[]>([]);
    const [links, setLinks] = useState<GroupLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    const BACKEND_URL = 'http://localhost:8005';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectsRes, groupsRes, linksRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}/syllabus/subjects`),
                    axios.get(`${BACKEND_URL}/whatsapp/groups`),
                    axios.get(`${BACKEND_URL}/whatsapp/links`)
                ]);
                
                setSubjects(subjectsRes.data);
                setWhatsappGroups(groupsRes.data);
                setLinks(linksRes.data);
            } catch (err) {
                console.error("Error fetching linking data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLink = async (subject: string, groupId: string) => {
        setSaving(subject);
        try {
            await axios.post(`${BACKEND_URL}/whatsapp/link`, {
                className: "B.Tech CSE", // Mock class name for now
                subjectCode: subject,
                whatsappGroupId: groupId,
                teacherId: "default_teacher",
                isLinked: true
            });
            
            // Refresh links
            const res = await axios.get(`${BACKEND_URL}/whatsapp/links`);
            setLinks(res.data);
        } catch (err) {
            console.error("Failed to link group:", err);
            alert("Error saving link. Check console for details.");
        } finally {
            setSaving(null);
        }
    };

    const getLinkedGroupId = (subject: string) => {
        return links.find(l => l.subjectCode === subject)?.whatsappGroupId || "";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin text-blue-500">
                    <RefreshCcw size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-green-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Communication Bridge</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">WhatsApp Group Linking</h1>
                <p className="text-slate-500 font-medium mt-1">Connect your classes to WhatsApp groups for automated notices</p>
            </header>

            <div className="grid gap-6">
                {subjects.map((subject) => {
                    const currentGroupId = getLinkedGroupId(subject);
                    const isSaving = saving === subject;

                    return (
                        <div key={subject} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-none shadow-sm bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <LinkIcon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">{subject}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">B.Tech CSE 2nd Year</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <select 
                                    className="bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                    defaultValue={currentGroupId}
                                    onChange={(e) => handleLink(subject, e.target.value)}
                                    disabled={isSaving}
                                >
                                    <option value="">Select WhatsApp Group</option>
                                    {whatsappGroups.map(group => (
                                        <option key={group.id} value={group.id}>{group.name}</option>
                                    ))}
                                </select>

                                <div className={`p-2.5 rounded-xl border ${currentGroupId ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                                    {currentGroupId ? <Check size={18} /> : <AlertCircle size={18} />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {subjects.length === 0 && (
                <div className="card p-12 text-center border-dashed border-2 border-slate-200">
                    <p className="text-slate-400 font-bold italic">No subjects found to link.</p>
                </div>
            )}

            <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <h5 className="font-black text-blue-900 text-sm mb-2 flex items-center gap-2">
                    <AlertCircle size={16} /> How it works
                </h5>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Once a subject is linked to a WhatsApp group, any "Official Exam Notice" generated for that subject will be automatically sent to the group. Make sure you have the correct Group JID (e.g., 12345@g.us) linked.
                </p>
            </div>
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send, Flame, ThumbsUp, MessageCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { RatingQuestion, VoiceAsk } from '../types';

export default function Hub() {
  // Q&A Board states
  const [questions, setQuestions] = useState<RatingQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [authorName, setAuthorName] = useState('');

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceList, setVoiceList] = useState<VoiceAsk[]>([]);
  const [voiceAuthor, setVoiceAuthor] = useState('');
  const [recError, setRecError] = useState<string | null>(null);

  // Micro playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [playbackAudio, setPlaybackAudio] = useState<HTMLAudioElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial Q&A board & record lists
  useEffect(() => {
    const storedQ = localStorage.getItem('bany_hub_questions');
    if (storedQ) {
      setQuestions(JSON.parse(storedQ));
    } else {
      const defaultQ: RatingQuestion[] = [
        {
          id: 'q-1',
          author: 'Marc de Lyon',
          question: 'Comment fais-tu pour relancer des invités timides ou très corporate lors des enregistrements ?',
          upvotes: 42,
          isUpvoted: false,
          replies: ['Le secret, c’est les 15 minutes de café hors-micro avant de lancer. On brise la glace sur des sujets personnels sans aucun enjeu.', 'Merci pour la question !'],
          createdAt: '20 Mai 2026',
        },
        {
          id: 'q-2',
          author: 'Estelle B.',
          question: 'Est-il possible d’inviter des entrepreneurs de la Green Tech dans les prochains épisodes ?',
          upvotes: 28,
          isUpvoted: false,
          replies: ['Absolument, l’équipe planche déjà sur deux profils d’impact écocitoyen pour le mois de juin ! Restez connectés.'],
          createdAt: '18 Mai 2026',
        }
      ];
      setQuestions(defaultQ);
      localStorage.setItem('bany_hub_questions', JSON.stringify(defaultQ));
    }

    const storedV = localStorage.getItem('bany_voice_list');
    if (storedV) {
      setVoiceList(JSON.parse(storedV));
    }
  }, []);

  // Sync questions with storage
  const syncQuestions = (newQ: RatingQuestion[]) => {
    setQuestions(newQ);
    localStorage.setItem('bany_hub_questions', JSON.stringify(newQ));
  };

  const handleUpvote = (id: string) => {
    const updated = questions.map((q) => {
      if (q.id === id) {
        const nextUpvoted = !q.isUpvoted;
        return {
          ...q,
          isUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? q.upvotes + 1 : q.upvotes - 1,
        };
      }
      return q;
    });
    syncQuestions(updated);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const record: RatingQuestion = {
      id: `q-${Date.now()}`,
      author: authorName.trim() || 'Auditeur Anonyme',
      question: newQuestionText.trim(),
      upvotes: 1,
      isUpvoted: true,
      createdAt: 'Aujourd\'hui',
    };

    const nextList = [record, ...questions];
    syncQuestions(nextList);
    setNewQuestionText('');
    setAuthorName('');
  };

  // Real Microscope Recording operations
  const startVoiceRecording = async () => {
    audioChunksRef.current = [];
    setRecError(null);
    setAudioUrl(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop all track streams so microphone light turns off
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start counter timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopVoiceRecording(); // limit to 60 seconds
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      setRecError('Accès microphone refusé ou non disponible. Veuillez vérifier les permissions de votre navigateur.');
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSendVoice = () => {
    if (!audioUrl) return;

    const item: VoiceAsk = {
      id: `v-${Date.now()}`,
      author: voiceAuthor.trim() || 'Chaud Partisan',
      duration: recordingSeconds,
      audioBlobUrl: audioUrl,
      createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    const nextList = [item, ...voiceList];
    setVoiceList(nextList);
    localStorage.setItem('bany_voice_list', JSON.stringify(nextList));

    // Reset recording panel
    setAudioUrl(null);
    setRecordingSeconds(0);
    setVoiceAuthor('');
  };

  const deleteVoiceItem = (id: string) => {
    const nextList = voiceList.filter((v) => v.id !== id);
    setVoiceList(nextList);
    localStorage.setItem('bany_voice_list', JSON.stringify(nextList));
    
    if (playingVoiceId === id && playbackAudio) {
      playbackAudio.pause();
      setPlayingVoiceId(null);
    }
  };

  // Playback simulated/real voice files
  const toggleVoicePlay = (item: VoiceAsk) => {
    if (playingVoiceId === item.id && playbackAudio) {
      playbackAudio.pause();
      setPlayingVoiceId(null);
      setPlaybackAudio(null);
    } else {
      // Pause any active play
      if (playbackAudio) {
        playbackAudio.pause();
      }

      const audio = new Audio(item.audioBlobUrl);
      audio.onended = () => {
        setPlayingVoiceId(null);
        setPlaybackAudio(null);
      };
      
      setPlayingVoiceId(item.id);
      setPlaybackAudio(audio);
      audio.play().catch(() => {
        setPlayingVoiceId(null);
        setPlaybackAudio(null);
      });
    }
  };

  const formatSec = (totS: number) => {
    const mins = Math.floor(totS / 60);
    const secs = totS % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section 
      id="audience-hub"
      className="bg-stone-950 py-16 lg:py-24 border-b border-stone-800/60"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Content */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1 rounded-full">
            ESPACE AUDIENCE COLLABORATIF
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 uppercase tracking-tight leading-none">
            Audience Hub
          </h2>
          <p className="text-sm font-sans text-stone-400">
            Posez vos questions de vive voix, proposez des thèmes de débats, ou upvotez les questions clés de la communauté de Bany.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Micro Recorder Panel / Left side / 5 cols */}
          <div className="lg:col-span-5 bg-stone-900/40 border border-stone-850 p-6 rounded-2xl space-y-6">
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-150 uppercase tracking-wide flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-500" />
                Dédicace / Vos Messages Vocaux
              </h3>
              <p className="text-xs text-stone-450 leading-relaxed font-sans">
                Enregistrez un message audio de 60 secondes maximum. Les plus belles dédicaces ou questions techniques seront commentées live par Bany !
              </p>
            </div>

            {/* Recorder Interface Canvas */}
            <div className="p-6 bg-stone-950 border border-stone-850 rounded-xl relative overflow-hidden flex flex-col items-center justify-center space-y-4 shadow-inner">
              
              {isRecording ? (
                /* Recording indicator UI */
                <div className="space-y-3 text-center w-full">
                  <div className="flex items-center justify-center gap-1.5 text-rose-500 animate-pulse font-mono text-xs font-bold uppercase">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  Enregistrement en direct
                  </div>
                  
                  {/* Waveforms simulator */}
                  <div className="flex items-end justify-center gap-1 h-8">
                    {[3, 7, 5, 8, 4, 9, 6, 8, 4, 7, 3, 5, 2, 6, 8, 4].map((h, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${h * 4}px` }} 
                        className="w-1 bg-rose-500/80 rounded animate-bounce shrink-0"
                      />
                    ))}
                  </div>

                  <span className="block font-mono text-xl font-bold text-stone-100">
                    {formatSec(recordingSeconds)}
                  </span>

                  <button
                    onClick={stopVoiceRecording}
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-stone-100 font-mono text-xs font-bold rounded-xl transition cursor-pointer mx-auto shadow-md"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" /> Arrêter l'enregistrement
                  </button>
                </div>
              ) : audioUrl ? (
                /* Edit/Submit Voice Message UI */
                <div className="space-y-4 w-full text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" /> Message Enregistré !
                  </div>

                  {/* Simulated wave static preview */}
                  <div className="bg-stone-900 border border-stone-850 p-3 rounded-lg flex items-center justify-between text-left font-mono text-xs text-stone-350">
                    <span>Aperçu de l'enregistrement</span>
                    <span className="text-amber-500 font-bold">{formatSec(recordingSeconds)}</span>
                  </div>

                  {/* Submission Name field */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="voiceAuthor-input" className="block text-[9px] font-mono text-stone-500 uppercase tracking-widest font-bold">
                      Nom / Pseudo de l'Expéditeur
                    </label>
                    <input
                      id="voiceAuthor-input"
                      type="text"
                      placeholder="Ex: Sophie de Marseille"
                      value={voiceAuthor}
                      onChange={(e) => setVoiceAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 rounded-lg text-xs font-mono"
                    />
                  </div>

                  {/* Controls to discard or submit voice key */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => setAudioUrl(null)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-stone-900 border border-stone-800 hover:text-stone-100 rounded-xl text-stone-400 font-mono text-xs font-bold cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Reprendre
                    </button>
                    <button
                      onClick={handleSendVoice}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-mono text-xs font-bold cursor-pointer transition"
                    >
                      <Send className="w-3.5 h-3.5" /> Envoyer à Bany
                    </button>
                  </div>
                </div>
              ) : (
                /* Initial Idle Trigger state */
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                    <Mic className="w-6 h-6" />
                  </div>
                  <button
                    onClick={startVoiceRecording}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs rounded-xl transition cursor-pointer transform hover:scale-102 shadow-lg shadow-amber-500/10 animate-pulse"
                  >
                    COMMENCER L'ENREGISTREMENT
                  </button>
                  <span className="block text-[10px] text-stone-550 font-mono">
                    Autorisation requise pour utiliser le microphone.
                  </span>
                </div>
              )}

              {/* Error boundary details */}
              {recError && (
                <p className="text-[10px] text-rose-500 leading-relaxed font-mono px-2 pt-2 text-center border-t border-stone-900">
                  ⚠️ {recError}
                </p>
              )}

            </div>

            {/* List of Submitted Live User messages */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block">
                Messages Vocaux Récents ({voiceList.length})
              </span>
              
              {voiceList.length === 0 ? (
                <div className="p-4 rounded-xl border border-stone-850 border-dashed text-center text-xs text-stone-600 font-mono">
                  Aucun message vocal reçu pour le moment.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {voiceList.map((voice) => {
                    const isPlayingThis = playingVoiceId === voice.id;
                    return (
                      <div 
                        key={voice.id} 
                        className="p-3 bg-stone-950 border border-stone-850 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden text-left">
                          <button
                            onClick={() => toggleVoicePlay(voice)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-900 border border-stone-800 text-amber-500 hover:text-amber-400 cursor-pointer"
                          >
                            {isPlayingThis ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                          </button>
                          <div className="overflow-hidden leading-tight">
                            <span className="font-bold text-stone-200 block truncate">{voice.author}</span>
                            <span className="text-[10px] text-stone-500 font-mono block">Durée : {formatSec(voice.duration)} • {voice.createdAt}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => deleteVoiceItem(voice.id)}
                          className="p-1.5 text-stone-600 hover:text-stone-300 transition"
                          title="Supprimer mon enregistrement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Q&A Interactive Thread Board / Right status / 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-850 pb-3">
              <h3 className="text-base font-bold text-stone-150 uppercase tracking-wide flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                La Boite à Questions
              </h3>
              <span className="text-xs font-mono text-stone-500">
                {questions.length} questions soumises
              </span>
            </div>

            {/* Quick Submit Field */}
            <form onSubmit={handleSubmitQuestion} className="bg-stone-900/30 border border-stone-850 p-5 rounded-2xl space-y-4">
              
              <div className="space-y-1.5 text-left">
                <label htmlFor="question-textarea" className="block text-[9px] font-mono text-stone-500 uppercase tracking-widest font-bold">
                  Posez votre question à Dany Talks
                </label>
                <textarea
                  id="question-textarea"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  maxLength={180}
                  required
                  rows={2}
                  placeholder="Ex: Quelle méthode utilises-tu pour monétiser un podcast francophone ?"
                  className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 rounded-xl text-xs font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Author input */}
                <input
                  type="text"
                  placeholder="Votre Nom (Ex: Karim)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 bg-stone-950 border border-stone-850 text-stone-100 placeholder-stone-600 focus:border-amber-500 rounded-lg text-xs font-mono focus:outline-none"
                />
                
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs rounded-lg transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> SOUMETTRE LA QUESTION
                </button>
              </div>

            </form>

            {/* Render Question Cards with upvotes & replies */}
            <div className="space-y-4">
              {questions.map((item) => (
                <div 
                  key={item.id} 
                  className="p-5 bg-stone-900/50 border border-stone-850 rounded-2xl flex flex-col md:flex-row items-start gap-4 transition duration-300"
                >
                  
                  {/* Upvotes Counter Node (Left column) */}
                  <button 
                    onClick={() => handleUpvote(item.id)}
                    className={`flex flex-row md:flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-xl border transition cursor-pointer shrink-0 md:w-14 text-center ${
                      item.isUpvoted 
                        ? 'border-amber-500 bg-amber-500/5 text-amber-500' 
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono font-bold leading-none">{item.upvotes}</span>
                  </button>

                  {/* Body details */}
                  <div className="flex-1 space-y-3">
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-stone-250 truncate">{item.author}</span>
                        <span className="text-[10px] text-stone-500 font-mono shrink-0">{item.createdAt}</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        "{item.question}"
                      </p>
                    </div>

                    {/* Replies segment */}
                    {item.replies && item.replies.length > 0 && (
                      <div className="pl-4 border-l border-amber-500/20 space-y-2 mt-2">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-amber-500 uppercase font-black">
                          <MessageCircle className="w-3.5 h-3.5 text-amber-500" /> Réponse de l'hôte
                        </div>
                        {item.replies.map((reply, index) => (
                          <div key={index} className="p-3 bg-stone-950/60 rounded-lg text-xs text-stone-400 italic">
                            {reply}
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

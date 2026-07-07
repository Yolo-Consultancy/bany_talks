import React, { useState, useEffect } from 'react';
import { Send, ThumbsUp, MessageCircle } from 'lucide-react';
import { RatingQuestion } from '../types';

const inputClass =
  'w-full px-0 py-3 bg-transparent border-b border-white/10 focus:border-rose-500/50 text-stone-200 placeholder-stone-600 focus:outline-none transition text-sm font-body';

const labelClass = 'block text-xs text-stone-500 font-body mb-2';

export default function Hub() {
  const [questions, setQuestions] = useState<RatingQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [authorName, setAuthorName] = useState('');

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
          replies: ["Le secret, c'est les 15 minutes de café hors-micro avant de lancer. On brise la glace sur des sujets personnels sans aucun enjeu.", 'Merci pour la question !'],
          createdAt: '20 Mai 2026',
        },
        {
          id: 'q-2',
          author: 'Estelle B.',
          question: "Est-il possible d'inviter des entrepreneurs de la Green Tech dans les prochains épisodes ?",
          upvotes: 28,
          isUpvoted: false,
          replies: ["Absolument, l'équipe planche déjà sur deux profils d'impact écocitoyen pour le mois de juin ! Restez connectés."],
          createdAt: '18 Mai 2026',
        },
      ];
      setQuestions(defaultQ);
      localStorage.setItem('bany_hub_questions', JSON.stringify(defaultQ));
    }
  }, []);

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
      createdAt: "Aujourd'hui",
    };

    syncQuestions([record, ...questions]);
    setNewQuestionText('');
    setAuthorName('');
  };

  const totalUpvotes = questions.reduce((sum, q) => sum + q.upvotes, 0);

  return (
    <section id="audience-hub" className="bg-stone-950 py-20 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="space-y-5 mb-16 lg:mb-20">
          <p className="section-label">Communauté</p>
          <h2 className="font-display text-4xl sm:text-5xl text-stone-100 font-medium leading-tight">
            Audience Hub
          </h2>
          <p className="text-stone-500 font-body text-base leading-relaxed max-w-lg">
            Posez vos questions et proposez des thèmes de débat — la communauté Bany Talks participe directement aux prochains épisodes.
          </p>
          <div className="flex gap-10 pt-4 border-t border-white/5">
            <div>
              <span className="block font-display text-2xl text-rose-400">{questions.length}</span>
              <span className="block text-xs text-stone-600 font-body mt-1">Questions</span>
            </div>
            <div>
              <span className="block font-display text-2xl text-rose-400">{totalUpvotes}</span>
              <span className="block text-xs text-stone-600 font-body mt-1">Votes communauté</span>
            </div>
          </div>
        </div>

        <hr className="editorial-rule mb-12 lg:mb-16" />

        <div className="space-y-10 text-left">
          <div className="flex items-end justify-between border-b border-white/5 pb-4">
            <div>
              <p className="section-label text-[0.6rem] mb-2">Questions</p>
              <h3 className="font-display text-2xl text-stone-100 font-medium">
                La boîte à questions
              </h3>
            </div>
            <span className="text-xs text-stone-600 font-body">
              {questions.length} soumises
            </span>
          </div>

          <form onSubmit={handleSubmitQuestion} className="space-y-6">
            <div>
              <label htmlFor="question-textarea" className={labelClass}>
                Votre question pour Bany
              </label>
              <textarea
                id="question-textarea"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                maxLength={180}
                required
                rows={3}
                placeholder="Ex : Quelle méthode utilises-tu pour monétiser un podcast francophone ?"
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="flex-1">
                <label htmlFor="author-input" className={labelClass}>Votre nom</label>
                <input
                  id="author-input"
                  type="text"
                  placeholder="Karim, Sophie…"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button type="submit" className="btn-primary shrink-0">
                Envoyer
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="space-y-0 divide-y divide-white/5">
            {questions.map((item) => (
              <article key={item.id} className="py-8 flex gap-6 items-start">
                <button
                  onClick={() => handleUpvote(item.id)}
                  className={`flex flex-col items-center gap-1 min-w-[3rem] pt-1 transition cursor-pointer ${
                    item.isUpvoted ? 'text-rose-400' : 'text-stone-600 hover:text-stone-400'
                  }`}
                  aria-label="Voter pour cette question"
                >
                  <ThumbsUp className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm font-body font-medium tabular-nums">{item.upvotes}</span>
                </button>

                <div className="flex-1 space-y-4 min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-body font-medium text-stone-300">{item.author}</span>
                      <span className="text-xs text-stone-600 font-body shrink-0">{item.createdAt}</span>
                    </div>
                    <p className="text-stone-400 font-body leading-relaxed">
                      {item.question}
                    </p>
                  </div>

                  {item.replies && item.replies.length > 0 && (
                    <div className="border-l-2 border-rose-500/30 pl-5 space-y-3">
                      <p className="text-xs text-rose-500/80 font-body flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Réponse de Bany
                      </p>
                      {item.replies.map((reply, index) => (
                        <p key={index} className="text-sm text-stone-500 font-body italic leading-relaxed">
                          {reply}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

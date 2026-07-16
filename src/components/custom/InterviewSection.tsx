import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewRound } from "@/types";
import { PlusIcon, TrashIcon } from "@/components/ui/Icons";

interface InterviewSectionProps {
  interviews: InterviewRound[];
  onChange: (interviews: InterviewRound[]) => void;
}

export function InterviewSection({
  interviews,
  onChange,
}: InterviewSectionProps) {
  const addRound = () => {
    const newRound: InterviewRound = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      notes: "",
      questions: [],
    };
    onChange([...interviews, newRound]);
  };

  const updateRound = (id: string, updates: Partial<InterviewRound>) => {
    onChange(interviews.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const deleteRound = (id: string) => {
    onChange(interviews.filter((i) => i.id !== id));
  };

  const addQuestion = (roundId: string) => {
    const round = interviews.find((i) => i.id === roundId);
    if (round) {
      updateRound(roundId, { questions: [...round.questions, ""] });
    }
  };

  const updateQuestion = (roundId: string, idx: number, text: string) => {
    const round = interviews.find((i) => i.id === roundId);
    if (round) {
      const newQuestions = [...round.questions];
      newQuestions[idx] = text;
      updateRound(roundId, { questions: newQuestions });
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex justify-between items-center">
        <h3 className="text-muted-foreground font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Interview Rounds
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addRound}
          className="text-xs h-7 ml-auto text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
        >
          <PlusIcon className="w-3 h-3 mr-1" /> Add Round
        </Button>
      </div>

      <div className="space-y-4">
        {interviews.map((round, index) => (
          <div
            key={round.id}
            className="bg-secondary border border-border/50 rounded-lg p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                Round {index + 1}
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="bg-secondary border-border text-muted-foreground h-8 w-auto text-xs"
                  value={round.date.split("T")[0]}
                  onChange={(e) =>
                    updateRound(round.id, { date: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRound(round.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-900/20"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Textarea
                  className="bg-secondary border-border text-muted-foreground text-sm focus-visible:ring-purple-500"
                  placeholder="General notes about the interview..."
                  rows={2}
                  value={round.notes}
                  onChange={(e) =>
                    updateRound(round.id, { notes: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Questions Asked
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addQuestion(round.id)}
                    className="h-6 text-xs text-muted-foreground hover:text-muted-foreground"
                  >
                    <PlusIcon className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>

                {round.questions.map((q, qIdx) => (
                  <div key={qIdx} className="flex gap-2 items-center">
                    <span className="text-muted-foreground text-sm">•</span>
                    <Input
                      className="bg-transparent border-b border-transparent border-b-zinc-700 focus:border-purple-500 rounded-none h-8 px-0 text-muted-foreground text-sm shadow-none focus-visible:ring-0"
                      placeholder="What question did they ask?"
                      value={q}
                      onChange={(e) =>
                        updateQuestion(round.id, qIdx, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {interviews.length === 0 && (
          <div className="text-center py-4 bg-secondary rounded border border-dashed border-border">
            <p className="text-muted-foreground text-sm italic">
              No interviews tracked yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

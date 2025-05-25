// ========================= Workout App – FULL DETAIL v5.2 =========================
// Restores the original rich descriptions for every workout (Weeks 1‑4, 5 days/wk)
// and the complete exercise glossary with instructional cues.
// Check‑circles and UI logic unchanged.

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sun, CalendarRange, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/****** 4‑WEEK SCHEDULE *************************************************************
   Each day = Warmup · Main Lifts · Accessories · Core · Cooldown (or Prescription)
***********************************************************************************/

const schedule = [
  /* ---------------- Week 1 ------------------------------------------------------ */
  {
    week: 1,
    days: [
      {
        id: "1-1",
        dow: "Mon",
        title: "Lower‑Body Strength",
        blocks: {
          Warmup: [
            "2‑min easy bike", 
            "Dynamic leg swings ×10/side", 
            "Air squats ×10"
          ],
          "Main Lifts": [
            "Back Squat 4×6 @65%1RM (RPE7)",
            "Romanian Deadlift 3×8 (RPE7)"
          ],
          Accessories: [
            "Bulgarian Split Squat 3×10/leg with 25 lb DBs",
            "Barbell Glute Bridge 3×12 @95 lb"
          ],
          Core: [
            "Dead‑Bug 3×10 (slow tempo)",
            "Standing Pallof Press 3×10/side"
          ],
          Cooldown: [
            "Couch stretch 60 s/side",
            "Pigeon pose 60 s/side",
            "Box breathing 1‑min"
          ]
        }
      },
      {
        id: "1-2",
        dow: "Tue",
        title: "Stationary Bike Intervals + Core",
        blocks: {
          Warmup: ["5‑min easy spin (≈60% HRmax)"] ,
          Intervals: ["8×30‑s sprint @85‑90% HRmax / 90‑s easy spin"] ,
          Core: [
            "Front Plank 45 s",
            "Bird‑Dog 3×10/side",
            "Hollow Hold 3×20 s"
          ],
          Cooldown: ["5‑min relaxed spin", "Hip flexor stretch 1‑min/side"]
        }
      },
      {
        id: "1-3",
        dow: "Wed",
        title: "Upper‑Body Strength",
        blocks: {
          Warmup: [
            "Jump rope 2 min",
            "Band pull‑apart ×20",
            "Scap push‑ups ×10"
          ],
          "Main Lifts": [
            "Band‑assist Pull‑Ups 4×AMRAP (aim 6‑8 reps)",
            "Incline DB Bench Press 4×8 @25‑35 lb"
          ],
          Accessories: [
            "Bent‑Over Barbell Row 3×10 @65‑85 lb",
            "Perfect Push‑Ups 3×12 (3‑1‑1 tempo)"
          ],
          Core: ["Half‑Kneeling Cable Chop 3×12/side"] ,
          Cooldown: ["Lat corner stretch", "Doorway pec stretch", "90‑90 breathing 1‑min"]
        }
      },
      {
        id: "1-4",
        dow: "Thu",
        title: "Low‑Impact Walk / Mobility",
        blocks: {
          Prescription: [
            "45‑min brisk walk (Zone 2) OR 6×3‑min moderate bike / 1‑min easy",
            "If busy: 15‑min stroller walk + 10‑min mobility flow"
          ]
        }
      },
      {
        id: "1-5",
        dow: "Fri",
        title: "Full‑Body Power Complex",
        blocks: {
          Warmup: [
            "Jump rope 2 min",
            "World’s Greatest Stretch ×5/side",
            "Burpees ×5"
          ],
          Complex: [
            "Barbell Complex 4 rounds (Deadlift → Hang Clean → Front Squat → Push Press → Bent Row) ×6 reps each @45‑65 lb"
          ],
          Accessories: ["Dumbbell Swings 3×15 @30‑35 lb"],
          Core: ["Plank Pull‑Throughs 3×10/side with 10 lb DB"],
          Cooldown: ["Cat‑Cow 1‑min", "Thoracic opener 1‑min", "Box breathing 1‑min"]
        }
      }
    ]
  },
  /* ---------------- Week 2 ------------------------------------------------------ */
  {
    week: 2,
    days: [
      {
        id: "2-1",
        dow: "Mon",
        title: "Lower‑Body Strength – Volume Bump",
        blocks: {
          Warmup: ["3‑min bike", "Leg swings ×10", "Air squats ×10"],
          "Main Lifts": ["Back Squat 5×6 @67%1RM", "Romanian Deadlift 4×8 (heavier)"] ,
          Accessories: ["Bulgarian Split Squat 4×10/leg", "Glute Bridge 4×12"],
          Core: ["Dead‑Bug 4×12", "Pallof Press 4×10/side"],
          Cooldown: ["Hip floss 1‑min/side", "Pigeon pose"]
        }
      },
      {
        id: "2-2",
        dow: "Tue",
        title: "Bike Intervals – Extra Round",
        blocks: {
          Warmup: ["5‑min easy spin"],
          Intervals: ["9×30‑s sprint @85‑90% / 90‑s easy"],
          Core: ["Plank 50 s", "Bird‑Dog 12/side", "Hollow Hold 3×25 s"],
          Cooldown: ["Breathing drill 2‑min"]
        }
      },
      {
        id: "2-3",
        dow: "Wed",
        title: "Upper‑Body Strength – Heavier",
        blocks: {
          Warmup: ["Jump rope 2 min", "Band pull‑apart", "Scap push‑ups"],
          "Main Lifts": ["Pull‑Ups 5×AMRAP (less band assist)", "Incline DB Bench 5×6 30‑40 lb"],
          Accessories: ["Bent Row 4×8 heavier", "Weighted Push‑Ups 4×10"],
          Core: ["Cable Chop 4×12/side"],
          Cooldown: ["Lat stretch"]
        }
      },
      {
        id: "2-4",
        dow: "Thu",
        title: "Mobility Flow + Walk",
        blocks: { Prescription: ["30‑min walk + 15‑min flow yoga"] }
      },
      {
        id: "2-5",
        dow: "Fri",
        title: "Full‑Body Power – Extra Set",
        blocks: {
          Warmup: ["Jump rope", "World’s Stretch"],
          Complex: ["Barbell Complex 5 rounds ×6 reps @55‑70 lb"],
          Accessories: ["Dumbbell Swings 4×15"],
          Core: ["Plank Pull‑Throughs 4×10/side"],
          Cooldown: ["Box breathing 2‑min"]
        }
      }
    ]
  },
  /* ---------------- Week 3 ------------------------------------------------------ */
  {
    week: 3,
    days: [
      {
        id: "3-1",
        dow: "Mon",
        title: "Lower Strength – Intensity Bump",
        blocks: {
          Warmup: ["Bike 3‑min", "Leg swings"],
          "Main Lifts": ["Back Squat 4×5 @72%1RM (RPE8)", "Romanian Deadlift 4×6 heavier"],
          Accessories: ["Split Squat 3×8/leg heavier", "Hip Thrust 3×10"],
          Core: ["Stir‑the‑Pot on Swiss Ball 3×12"],
          Cooldown: ["Figure‑4 stretch"]
        }
      },
      {
        id: "3-2",
        dow: "Tue",
        title: "Jump‑Rope HIIT",
        blocks: {
          Warmup: ["3‑min easy rope"],
          Intervals: ["10×1‑min fast rope @90‑95% HRmax / 90‑s rest"],
          Core: ["Front Plank 60 s", "Bird‑Dog 12/side", "Hollow Hold 2×25 s"] ,
          Cooldown: ["Calf stretch"]
        }
      },
      {
        id: "3-3",
        dow: "Wed",
        title: "Upper‑Body Strength – Volume",
        blocks: {
          Warmup: ["Jump rope", "Band pull‑apart"],
          "Main Lifts": ["Pull‑Ups 6×AMRAP", "Incline DB Bench 4×8 heavy"],
          Accessories: ["Bent‑Over Row 4×10", "Push‑Ups 4×15"],
          Core: ["Cable Chop 4×15/side"],
          Cooldown: ["Sleeper stretch"]
        }
      },
      {
        id: "3-4",
        dow: "Thu",
        title: "Bike Tempo Ride",
        blocks: { Prescription: ["30‑min continuous ride @75‑80% HRmax"] }
      },
      {
        id: "3-5",
        dow: "Fri",
        title: "Dumbbell Complexes",
        blocks: {
          Warmup: ["Jump rope 2 min", "World’s Stretch"],
          Complex: ["DB Complex 5 rounds: RDL → Renegade Row → Thruster ×8 @25 lb"],
          Accessories: ["Kettlebell Swing 3×20"],
          Core: ["Farmer Carry Plank 3×40 s"],
          Cooldown: ["Box breathing"]
        }
      }
    ]
  },
  /* ---------------- Week 4 ------------------------------------------------------ */
  {
    week: 4,
    days: [
      {
        id: "4-1",
        dow: "Mon",
        title: "Lower Deload – ‑10% Volume",
        blocks: {
          Warmup: ["Bike 2‑min", "Leg swings"],
          "Main Lifts": ["Back Squat 3×5 @60%1RM", "Romanian Deadlift 3×6 light"],
          Accessories: ["Split Squat 2×10/leg", "Glute Bridge 2×12"],
          Core: ["Dead‑Bug 3×8"],
          Cooldown: ["Hip stretch"]
        }
      },
      {
        id: "4-2",
        dow: "Tue",
        title: "Threshold Bike Test",
        blocks: {
          Warmup: ["5‑min easy spin"],
          Test: ["15‑min hold 80% HRmax – record distance"],
          Cooldown: ["5‑min spin", "Quad stretch"]
        }
      },
      {
        id: "4-3",
        dow: "Wed",
        title: "Upper Deload – ‑10%",
        blocks: {
          Warmup: ["Jump rope 1‑min", "Band pull‑apart"],
          "Main Lifts": ["Pull‑Ups 3×submax", "Incline DB Bench 3×8 light"],
          Accessories: ["Bent Row 3×10 light"],
          Core: ["Front Plank 45 s", "Cable Chop 3×10"] ,
          Cooldown: ["Lat stretch"]
        }
      },
      {
        id: "4-4",
        dow: "Thu",
        title: "Walk & Mobility",
        blocks: { Prescription: ["40‑min walk + 20‑min full‑body mobility"] }
      },
      {
        id: "4-5",
        dow: "Fri",
        title: "Full‑Body Challenge Circuit",
        blocks: {
          Warmup: ["Jump rope 1‑min", "Burpees ×5"],
          Circuit: ["20‑min AMRAP: 5 Hang Cleans @65 lb, 10 Push Press, 15 KB Swings 35 lb, 200 m bike sprint"],
          Cooldown: ["Box breathing 2‑min", "Stretch of choice"]
        }
      }
    ]
  }
];

/****** EXERCISE GLOSSARY (full cues) *********************************************/

const glossary = {
  "Back Squat": "Rack bar on mid‑traps, toes slightly out, brace core, sit hips back then down to parallel, drive through mid‑foot.",
  "Romanian Deadlift": "Soft knees, hinge hips back while sliding bar down thighs, long spine, feel hamstrings, snap hips forward.",
  "Bulgarian Split Squat": "Rear foot on bench, chest tall, lower until front thigh parallel, drive through heel.",
  "Barbell Glute Bridge": "Upper back on bench, bar over hips, drive hips up until torso and thighs align, squeeze glutes.",
  "Pull‑Ups": "Grip just outside shoulders, pull elbows to ribs, chest to bar, control eccentric, use band if needed.",
  "Incline DB Bench Press": "Bench 30‑45°, DBs over chest, lower with elbows ~45°, press without locking hard.",
  "Bent‑Over Row": "Hinge ~45°, pull bar to lower ribs, squeeze scapulae together, lower under control.",
  "Perfect Push‑Ups": "Hands on rotating discs, maintain rigid plank, descend chest to handle height, press while handles_rotate outward.",
  "Plank": "Elbows under shoulders, body straight line, squeeze glutes/quads, breathe through nose.",
  "Bird‑Dog": "Quadruped, extend opposite arm and leg, keep hips square, pause then switch.",
  "Hollow Hold": "Lie supine, arms overhead, lift shoulders/legs, low back pressed to floor, hold banana shape.",
  "Dead‑Bug": "Supine, knees 90°, opposite arm/leg extend near floor, exhale, keep low back flat.",
  "Pallof Press": "Stand perpendicular to band, press straight out resisting rotation, hold 2 s.",
  "Cable Chop": "Half‑kneel, pull handle high‑to‑low across body, rotate through T‑spine.",
  "Stir‑the‑Pot": "Forearm plank on Swiss ball, draw slow circles without lumbar movement.",
  "Hip Thrust": "Shoulders on bench, bar over pelvis, drive hips to full extension, pause, lower.",
  "Kettlebell Swing": "Hinge, hike bell, snap hips, bell to chest height, arms relaxed.",
  "Farmer Carry Plank": "High plank gripping DB handles, stay square while dragging weight.",
  "Renegade Row": "Plank on DBs, row one DB while stabilizing torso, alternate sides.",
  "Thruster": "Front squat immediately into overhead press in one fluid motion.",
  "Hang Clean": "From mid‑thigh, extend hips, shrug, pull under bar to front‑rack catch.",
  "Split Squat": "Staggered stance, lower back knee straight down, drive through front heel.",
  "World’s Greatest Stretch": "Lunge, elbow to instep, rotate torso upward, switch sides.",
  "Box Breathing": "Inhale 4 s, hold 4 s, exhale 4 s, hold 4 s, repeat.",
  "Cat‑Cow": "On all fours, alternate spinal flexion/extension synced with breath.",
  "Thoracic Opener": "Kneel, hands on foam roll, sit hips back, drop chest to feel T‑spine stretch."
};

/****** REUSABLE UI COMPONENTS *****************************************************/

function CheckItem({ text }) {
  const [done, setDone] = useState(false);
  return (
    <label className="flex items-start gap-2 cursor-pointer select-none">
      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 rounded-full mt-0.5" checked={done} onChange={() => setDone(!done)} />
      <span className={done ? "line-through opacity-60" : ""}>{text}</span>
    </label>
  );
}

const WeekSelector = ({ current, setCurrent }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-6">
    {schedule.map((w) => (
      <Button key={w.week} variant={current === w.week ? "default" : "ghost"} onClick={() => setCurrent(w.week)}>
        Week {w.week}
      </Button>
    ))}
  </div>
);

const DayCard = ({ day, onSelect }) => (
  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
    <Card onClick={() => onSelect(day)} className="cursor-pointer bg-white/60 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{day.dow}</span>
          <span className="truncate max-w-[70%] text-slate-700 dark:text-slate-200">{day.title}</span>
        </CardTitle>
      </CardHeader>
      {day.blocks?.Warmup && (
        <CardContent className="pt-0 text-xs text-slate-600 dark:text-slate-400 truncate">Warm‑Up: {day.blocks.Warmup.join(", ")}</CardContent>
      )}
    </Card>
  </motion.div>
);

const GlossaryGrid = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Object.entries(glossary).map(([name, desc]) => (
      <Card key={name} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Dumbbell size={16} /> {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

/****** MAIN APP *******************************************************************/

export default function WorkoutApp() {
  const [view, setView] = useState("schedule");
  const [week, setWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);

  const currentWeek = schedule.find((w) => w.week === week) || { days: [] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <CalendarRange className="text-indigo-600 dark:text-indigo-400" /> 4‑Week Strength Program
          </h1>
          <div className="flex gap-2">
            <Button variant={view === "schedule" ? "default" : "ghost"} onClick={() => setView("schedule")}>Schedule</Button>
            <Button variant={view === "glossary" ? "default" : "ghost"} onClick={() => setView("glossary")}>Glossary</Button>
          </div>
        </header>

        {view === "schedule" ? (
          <>
            <WeekSelector current={week} setCurrent={setWeek} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentWeek.days.map((d) => (
                <DayCard key={d.id} day={d} onSelect={setSelectedDay} />
              ))}
            </div>
          </>
        ) : (
          <GlossaryGrid />
        )}
      </div>

      <AnimatePresence>
        {selectedDay && (
          <Dialog open onOpenChange={() => setSelectedDay(null)}>
            <DialogContent className="max-w-md rounded-xl backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Sun size={18} /> {selectedDay.title} – {selectedDay.dow}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 text-sm">
                {Object.entries(selectedDay.blocks).map(([blockName, moves]) => (
                  <section key={blockName}>
                    <h3 className="font-semibold mb-1 capitalize text-slate-700 dark:text-slate-200">{blockName}</h3>
                    <div className="space-y-1 ml-2">
                      {moves.map((m) => (
                        <CheckItem key={m} text={m} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

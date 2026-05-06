MASTER BUILD PROMPT — FLOW EXECUTION APP

You are building a high-end productivity system, not a basic todo app.

This app must be designed around one core truth:

The user has many goals across many life domains, but fails with normal productivity apps because they create overwhelm, rigidity, guilt, and cognitive overload.

Your job is to eliminate those failures completely.

1. USER PROBLEM CONTEXT (CRITICAL)

The user has:

Extremely high number of goals across multiple domains (business, learning, religion, fitness, personal development)
Difficulty maintaining consistency over time
High sensitivity to overwhelm from UI clutter and information density
Strong dislike for:
dashboards with too many numbers
graphs and analytics-heavy screens
rigid scheduling systems
apps that show “lateness”, “failure”, or “overdue tasks”
constant notifications or guilt-based reminders

The user specifically stated:

Key psychological constraints:
If the app feels overwhelming → they stop using it
If it feels like punishment → motivation drops immediately
If it requires too much thinking → execution collapses
If everything is visible at once → cognitive shutdown happens
2. CORE DESIGN GOAL

This system must ensure:

The user always knows exactly what to do next without thinking or planning in the moment.

It must:

reduce cognitive load to near zero
preserve momentum at all times
prevent overwhelm by hiding complexity
support deep customization when requested (but never force it into default view)
3. PRODUCT TYPE

This is NOT:

a calendar app
a todo list app
a habit tracker
a dashboard system

This IS:

A real-time adaptive execution system with elastic time and identity-based consistency tracking.

4. CORE SYSTEM STRUCTURE

The system has 3 visible layers:

LAYER 1 — NOW (PRIMARY INTERFACE)

This is the default screen.

It shows only:

Current active task (single focus)
One main action button:
Start / Pause / Resume
One line:
“Next: [next action]”

Rules:

No lists
No calendars
No backlog
No analytics

Goal:

Reduce the entire system to a single action decision.

LAYER 2 — TODAY FLOW

This represents the user’s current day execution.

It contains:

sequence of work blocks
BUT NOT fixed timestamps (except anchors)
only duration + order

Each block:

can be started
paused
resumed
extended
shortened

The system automatically adjusts all remaining blocks when changes occur.

LAYER 3 — DOMAINS

Represents life areas:

Examples:

Business
Religion / learning
Fitness / combat sports
Personal projects
Skill development

Each domain shows ONLY:

current momentum state (simple language)
Strong / Stable / Weak / Inactive
recent activity signal (e.g. “recently active”)
next smallest action (critical)
no dashboards by default
5. TIME SYSTEM (VERY IMPORTANT)

The app uses an elastic time model, not fixed scheduling.

5.1 FIXED ANCHORS

Some events are fixed and non-negotiable:

prayer times
combat sports training (if set as fixed)

Rules:

always occur at real time
interrupt current work gently
never generate stress or penalty
5.2 FLEXIBLE BLOCKS

All other activities:

business work
studying
projects
learning

Properties:

have duration (e.g. 60 min intention)
NOT fixed timestamps
can move automatically when time shifts
5.3 ELASTIC TIME ENGINE RULES

The system tracks time like this:

If user works longer:
future blocks shift forward automatically
no warnings
no penalty states
system says: “adjusted +X min”
If user pauses:
timer freezes
state is preserved exactly
If user resumes:
continues seamlessly
If user finishes early:
remaining time is redistributed forward
6. CRITICAL BEHAVIOR RULES
Rule 1 — No guilt language

NEVER show:

late
overdue
missed
behind schedule

Instead use:

paused
resumed
adjusted
continued
Rule 2 — Single-focus cognition

User should only ever see:

one action at a time
Rule 3 — No overload visibility

If there are many tasks:

system hides them automatically
only next relevant step is shown
Rule 4 — Everything is recoverable

Nothing is ever lost:

everything can be paused
everything resumes later
no failure states exist
7. CONSISTENCY SYSTEM (NO GRAPHS, NO DASHBOARDS)

The system tracks consistency across domains WITHOUT numerical dashboards.

Each domain shows:

1. Momentum state (human readable)
Strong rhythm
Stable rhythm
Weak rhythm
Inactive
2. Direction
improving
stable
declining
3. Last engagement
today / yesterday / days ago
4. Next action
always a single smallest step

NO charts unless explicitly opened in deep mode.

8. ROUTINE SYSTEM

User defines routines like:

Routine A
Routine B
Routine C

Each routine contains:

structured sequence of blocks
durations only
NOT fixed timestamps

Then user assigns routines:

Monday → A
Tuesday → B
etc.

System executes them dynamically.

9. UI REQUIREMENTS
Design principles:
extremely clean
minimal text
calm visual hierarchy
no dense dashboards
no cluttered information screens
Navigation:

Maximum 3–4 tabs:

NOW
TODAY
DOMAINS
SETTINGS (advanced)
Progressive disclosure:
Main screen = action only
Tap = structure
Deep tap = full system customization
10. BEHAVIORAL GOAL

The system is successful if:

The user never thinks about planning, only about executing the next step.

11. IMPORTANT IMPLEMENTATION NOTE

Do NOT implement:

traditional calendar rigidity
task list overload UI
gamified points or dopamine spam
notification-heavy systems
guilt-based feedback loops
12. OUTPUT EXPECTATION

Build:

working frontend
state management for elastic time system
domain tracking system
routine engine
clean UI matching above constraints

Prioritize:

simplicity of interaction
psychological comfort
momentum preservation
zero cognitive overload

If implemented correctly, this system should feel like:

You open it → it tells you what to do → you do it → everything adapts quietly in the background.
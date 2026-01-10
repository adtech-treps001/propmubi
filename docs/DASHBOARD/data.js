/**
 * PROPMUBI DASHBOARD DATA
 * Last Updated: 2026-01-09 (Phase 2 Complete)
 */
window.PROJECT_DATA = {
    overview: {
        projectName: "PropMubi Trust OS",
        version: "Phase 3 (Marketing)",
        lastUpdated: "2026-01-09",
        overallProgress: 75,
        phase: "Phase 3 - Marketing Automation"
    },
    tasks: [
        // Phase 1 (Complete)
        { id: 1, name: "Backend Trust Engines", status: "DONE", progress: 100, startDate: "2026-01-08", endDate: "2026-01-08", team: "BE" },
        { id: 2, name: "API Endpoints (Auth, Property)", status: "DONE", progress: 100, startDate: "2026-01-08", endDate: "2026-01-08", team: "BE" },
        { id: 3, name: "Mobile Feed & Maps", status: "DONE", progress: 100, startDate: "2026-01-08", endDate: "2026-01-08", team: "MOB" },
        { id: 4, name: "Builder Dashboard", status: "DONE", progress: 100, startDate: "2026-01-08", endDate: "2026-01-08", team: "WEB" },
        { id: 5, name: "Legal & Inspection Services", status: "DONE", progress: 100, startDate: "2026-01-08", endDate: "2026-01-08", team: "BE" },

        // Phase 2 (Complete)
        { id: 6, name: "Agent Service (Network)", status: "DONE", progress: 100, startDate: "2026-01-09", endDate: "2026-01-09", team: "BE" },
        { id: 7, name: "Supply Ingestion (WhatsApp)", status: "DONE", progress: 100, startDate: "2026-01-09", endDate: "2026-01-09", team: "BE" },
        { id: 8, name: "CRM Governance & Commissions", status: "DONE", progress: 100, startDate: "2026-01-09", endDate: "2026-01-09", team: "BE" },
        { id: 9, name: "Agent Dashboard & Microsites", status: "DONE", progress: 100, startDate: "2026-01-09", endDate: "2026-01-09", team: "WEB" },
        { id: 10, name: "E2E Testing Infrastructure", status: "DONE", progress: 100, startDate: "2026-01-09", endDate: "2026-01-09", team: "QA" },

        // Phase 3 (In Progress)
        { id: 11, name: "Marketing Service Setup", status: "IN_PROGRESS", progress: 10, startDate: "2026-01-09", endDate: "2026-01-12", team: "BE" },
        { id: 12, name: "Auto-Reel Generator", status: "TODO", progress: 0, startDate: "2026-01-10", endDate: "2026-01-13", team: "AI" },
        { id: 13, name: "WhatsApp Campaign Manager", status: "TODO", progress: 0, startDate: "2026-01-11", endDate: "2026-01-14", team: "BE" },
        { id: 14, name: "Social Sentiment Analysis", status: "TODO", progress: 0, startDate: "2026-01-12", endDate: "2026-01-15", team: "DATA" }
    ],
    metrics: {
        totalTasks: 14,
        completedTasks: 10,
        inProgressTasks: 1,
        blockedTasks: 0,
        completionRate: 71
    }
};

import { getCalendarEvents } from "../../integrations/erp/erpAdapter.js";

export async function getAcademicCalendar(req, res) {
  try {
    const { collegeId } = req.params;
    const events = await getCalendarEvents(collegeId);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to load academic calendar" });
  }
}
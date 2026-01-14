"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CalendarEvent, EventType } from "@/types";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  initialDate?: Date;
  existingEvent?: CalendarEvent;
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
  existingEvent,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("Work");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [isAllDay, setIsAllDay] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        setTitle(existingEvent.title);
        setType(existingEvent.type);

        const start = new Date(existingEvent.startDate);
        const end = new Date(existingEvent.endDate);

        setStartDate(
          isValidDate(start) ? start.toISOString().split("T")[0] : "",
        );
        setStartTime(
          isValidDate(start) ? start.toTimeString().slice(0, 5) : "09:00",
        );
        setEndDate(isValidDate(end) ? end.toISOString().split("T")[0] : "");
        setEndTime(isValidDate(end) ? end.toTimeString().slice(0, 5) : "10:00");

        setIsAllDay(existingEvent.isAllDay || false);
        setDescription(existingEvent.description || "");
      } else {
        setTitle("");
        setType("Work");
        const dateStr = initialDate
          ? initialDate.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
        setStartDate(dateStr);
        setStartTime("09:00");
        setEndDate(dateStr);
        setEndTime("10:00");
        setIsAllDay(true); // Default to all day for ease
        setDescription("");
      }
    }
  }, [isOpen, initialDate, existingEvent]);

  const isValidDate = (d: Date) => d instanceof Date && !isNaN(d.getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let startIso, endIso;

    if (isAllDay) {
      // For all day, we just take the date part at 00:00
      startIso = new Date(startDate).toISOString();
      endIso = new Date(endDate).toISOString();
    } else {
      startIso = new Date(`${startDate}T${startTime}`).toISOString();
      endIso = new Date(`${endDate}T${endTime}`).toISOString();
    }

    onSave({
      title,
      type,
      startDate: startIso,
      endDate: endIso,
      description,
      isAllDay,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingEvent ? "Edit Event" : "Add Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Project Deadline"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as EventType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Task">Task</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="all-day"
              checked={isAllDay}
              onCheckedChange={setIsAllDay}
            />
            <Label htmlFor="all-day">All Day</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              {!isAllDay && (
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              {!isAllDay && (
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

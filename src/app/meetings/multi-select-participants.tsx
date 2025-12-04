
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MultiSelectParticipantsProps {
    participants: { name: string, avatar: string, role: string }[];
    selected: { name: string, avatar: string, role: string }[];
    onChange: (selected: { name: string, avatar: string, role: string }[]) => void;
}

export function MultiSelectParticipants({ participants, selected, onChange }: MultiSelectParticipantsProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (participant: {name: string, avatar: string, role: string}) => {
    if (selected.some(p => p.name === participant.name)) {
      onChange(selected.filter(p => p.name !== participant.name));
    } else {
      onChange([...selected, participant]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {selected.length > 0 ? selected.map(p => p.name).join(', ') : "Select participants..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search participants..." />
          <CommandEmpty>No participant found.</CommandEmpty>
          <CommandGroup>
            {participants.map((participant) => (
              <CommandItem
                key={participant.name}
                onSelect={() => handleSelect(participant)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.some(p => p.name === participant.name) ? "opacity-100" : "opacity-0"
                  )}
                />
                <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage data-ai-hint="person portrait" src={participant.avatar} />
                    <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {participant.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

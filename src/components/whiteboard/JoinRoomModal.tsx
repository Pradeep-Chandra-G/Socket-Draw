// src/components/whiteboard/JoinRoomModal.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      // Fetch whiteboard by room code
      const response = await fetch(`/api/whiteboards/join/${roomCode}`);
      const data = await response.json();

      if (response.ok && data.whiteboard) {
        router.push(`/whiteboard/${data.whiteboard.id}`);
        onClose();
      } else {
        setError(data.error || "Room not found");
      }
    } catch (err) {
      setError("Failed to join room. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleClose = () => {
    setRoomCode("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Join a Whiteboard">
      <div className="space-y-6">
        <p className="text-sm text-slate-600">
          Enter the room code shared by another user to join their whiteboard
          and collaborate in real-time.
        </p>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Room Code"
          placeholder="Enter 10-character code"
          value={roomCode}
          onChange={(e) => {
            setRoomCode(e.target.value.toUpperCase());
            setError("");
          }}
          maxLength={10}
          className="font-mono text-lg tracking-wider"
        />

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleClose}
            variant="secondary"
            className="flex-1"
            disabled={isJoining}
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoin}
            className="flex-1"
            disabled={isJoining || !roomCode.trim()}
          >
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Join Room
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

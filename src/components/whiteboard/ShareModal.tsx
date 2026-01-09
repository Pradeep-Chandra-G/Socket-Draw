// src/components/whiteboard/ShareModal.tsx

"use client";

import { useState } from "react";
import { Copy, Check, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  userCount: number;
  maxUsers: number;
}

export default function ShareModal({
  isOpen,
  onClose,
  roomCode,
  userCount,
  maxUsers,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/whiteboard/${roomCode}`;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Whiteboard"
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {userCount} / {maxUsers} users connected
            </p>
            <p className="text-xs text-gray-600">
              {maxUsers - userCount} slots available
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Code
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-base sm:text-lg font-semibold text-gray-900">
              {roomCode}
            </div>
            <Button
              onClick={() => handleCopy(roomCode)}
              variant="secondary"
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share Link
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 break-all">
              {shareUrl}
            </div>
            <Button
              onClick={() => handleCopy(shareUrl)}
              variant="secondary"
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Anyone with this room code can join and
            collaborate. Maximum {maxUsers} users can be connected
            simultaneously.
          </p>
        </div>
      </div>
    </Modal>
  );
}

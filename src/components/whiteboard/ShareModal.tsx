// src/components/whiteboard/ShareModal.tsx

"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Users,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
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
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const shareUrl = `${window.location.origin}/whiteboard/${roomCode}`;

  const handleCopy = async (text: string, type: "code" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Whiteboard">
      <div className="space-y-6">
        {/* User Count Status */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {userCount} / {maxUsers} users connected
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {maxUsers - userCount === 0
                ? "Room is full"
                : `${maxUsers - userCount} slot${
                    maxUsers - userCount > 1 ? "s" : ""
                  } available`}
            </p>
          </div>
        </div>

        {/* Room Code */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Room Code
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-mono text-lg font-bold text-slate-900 tracking-wider">
              {roomCode}
            </div>
            <Button
              onClick={() => handleCopy(roomCode, "code")}
              variant="secondary"
              className="flex-shrink-0 w-12 h-12 p-0"
            >
              {copiedCode ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Share Link */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Share Link
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-700 break-all overflow-hidden">
              <span className="line-clamp-2">{shareUrl}</span>
            </div>
            <Button
              onClick={() => handleCopy(shareUrl, "url")}
              variant="secondary"
              className="flex-shrink-0 w-12 h-12 p-0"
            >
              {copiedUrl ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Security Notice</p>
            <p className="text-amber-800">
              Anyone with this room code can join and collaborate. Maximum{" "}
              {maxUsers} users can be connected simultaneously.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Close
          </Button>
          <Button
            onClick={() => handleCopy(shareUrl, "url")}
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    </Modal>
  );
}

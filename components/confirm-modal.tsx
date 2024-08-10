"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  description: string;
}

export const ConfirmModal: React.FC<ConfirmModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  description
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button className="rounded-xl" disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="rounded-xl" type="submit" disabled={loading} variant="default" onClick={onConfirm}>Continue</Button>
      </div>
    </Modal>
  );
};

import { useState } from "react";
import { Button } from "../common-components";
import styled from "styled-components";
import { theme } from "../../theme";

interface ToggleableContentProps {
  buttonTitle: string;
  closeText: string;
  onClose?: () => void;
  onOpen?: () => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

const InnerContent = styled.div`
  padding: ${theme.spacing(3)} 0;
`;

export const ToggleableContent = ({
  buttonTitle,
  closeText,
  onClose,
  onOpen,
  children,
  defaultOpen,
}: ToggleableContentProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen ?? false);
  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          if (open && onClose) {
            onClose();
          }
          if (!open && onOpen) {
            onOpen();
          }
          setOpen(!open);
        }}
      >
        {!open ? buttonTitle : closeText}
      </Button>

      {open && <InnerContent>{children}</InnerContent>}
    </div>
  );
};

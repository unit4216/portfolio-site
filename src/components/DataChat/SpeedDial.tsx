import AddIcon from "@mui/icons-material/Add";
import ForumIcon from "@mui/icons-material/Forum";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { styled } from "@mui/material/styles";

interface CustomSpeedDialProps {
  onNewChat: () => void;
  onViewDatabases: () => void;
}

/**
 * Custom styled SpeedDial to match warm, neutral palette
 */
const WarmSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(8),
  right: theme.spacing(8),
  zIndex: 1300,
  '& .MuiFab-primary': {
    backgroundColor: '#e5e6e4',
    color: '#847577',
    border: '1.5px solid #cfd2cd',
    boxShadow: '0 4px 16px 0 rgba(132, 117, 119, 0.10)',
    '&:hover': {
      backgroundColor: '#dbdad6',
      color: '#847577',
    },
  },
  '& .MuiSpeedDialAction-fab': {
    backgroundColor: '#e5e6e4',
    color: '#847577',
    border: '1.5px solid #cfd2cd',
    '&:hover': {
      backgroundColor: '#dbdad6',
      color: '#847577',
    },
  },
  '& .MuiSpeedDialAction-staticTooltipLabel': {
    background: '#847577',
    color: '#fdf6ee',
    fontSize: '0.85rem',
    borderRadius: 6,
    boxShadow: '0 2px 8px 0 rgba(132, 117, 119, 0.10)',
  },
}));

/**
 * Speed dial component for quick actions
 */
export const CustomSpeedDial = ({ onNewChat, onViewDatabases }: CustomSpeedDialProps) => {
  return (
    <WarmSpeedDial
      ariaLabel="View Databases"
      icon={<AddIcon sx={{ fontSize: 32 }} />}
      direction="up"
      FabProps={{
        size: 'large',
      }}
    >
      <SpeedDialAction
        icon={<ForumIcon sx={{ fontSize: 24 }} />}
        tooltipTitle="New Chat"
        onClick={onNewChat}
      />
      <SpeedDialAction
        icon={<StorageIcon sx={{ fontSize: 24 }} />}
        tooltipTitle="View Databases"
        onClick={onViewDatabases}
      />
    </WarmSpeedDial>
  );
}; 
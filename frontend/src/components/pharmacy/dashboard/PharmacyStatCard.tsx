import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
  loading?: boolean;
};

const PharmacyStatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "#1976d2",
  loading = false,
}: Props) => {
  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        borderLeft: `5px solid ${color}`,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            {loading ? (
              <Skeleton
                width={70}
                height={40}
              />
            ) : (
              <Typography
                variant="h4"
                fontWeight={700}
              >
                {value}
              </Typography>
            )}

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {icon && (
            <Box
              sx={{
                color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PharmacyStatCard;
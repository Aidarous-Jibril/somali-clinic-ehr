import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { PharmacyToolbarAction, PharmacyToolbarFilter } from "../../../features/pharmacy";


type PharmacyToolbarProps = {
  search?: string;
  searchPlaceholder?: string;

  filters?: PharmacyToolbarFilter[];
  actions?: PharmacyToolbarAction[];

  onSearch?: (value: string) => void;
  onFilterChange?: ( id: string, value: string ) => void;
};

const PharmacyToolbar = ({
  search = "",
  searchPlaceholder = "Search...",

  filters = [],
  actions = [],

  onSearch,
  onFilterChange,
}: PharmacyToolbarProps) => {
  return (
    <Box mb={3}>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
      >
        {/* Left side */}
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          flex={1}
        >
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) =>
              onSearch?.(e.target.value)
            }
            sx={{
              minWidth: 280,
            }}
          />

          {filters.map((filter) => (
            <FormControl
              key={filter.id}
              size="small"
              sx={{
                minWidth: 180,
              }}
            >
              <InputLabel>
                {filter.label}
              </InputLabel>

              <Select
                label={filter.label}
                value={filter.value}
                onChange={(e) =>
                  onFilterChange?.(
                    filter.id,
                    String(e.target.value)
                  )
                }
              >
                {filter.options.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Stack>

        {/* Right side */}
        <Stack direction="row" spacing={1}>
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="contained"
              startIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default PharmacyToolbar;
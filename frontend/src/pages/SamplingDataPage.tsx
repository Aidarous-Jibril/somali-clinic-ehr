import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import SamplingActions from "../components/sampling/SamplingActions";
import SamplingDetails from "../components/sampling/SamplingDetails";
import SamplingWorklist from "../components/sampling/SamplingWorklist";

import { useSamplingWorklist } from "../hooks/sampling/useSamplingWorklist";
import PrintDialog from "../components/sampling/PrintDialog";

const SamplingDataPage: React.FC = () => {
  const { data: rows = [], isLoading, refetch, } = useSamplingWorklist();

  const [selectedId, setSelectedId] = useState("");
  const [scope, setScope] = useState< "selected" | "all" >("all");
  const [orderingUnit, setOrderingUnit] = useState("");
  const [showPerformed, setShowPerformed] = useState(false);
  const [showExtended, setShowExtended] = useState(true);
  const [openPrint, setOpenPrint] = useState(false);

  useEffect(() => {
    if (rows.length > 0 && !selectedId) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  const selected = useMemo(() => {
    return ( rows.find((r: any) => r.id === selectedId) ?? null );
  }, [rows, selectedId]);

  const visibleRows = useMemo(() => {
    let filtered = [...rows];

    if (!showPerformed) {
      filtered = filtered.filter( (r) => !r.sent );
    }

    if (scope === "selected" && selected) {
      filtered = filtered.filter( (r) => r.personId === selected.personId );
    }

    if (orderingUnit) {
      filtered = filtered.filter( (r) => r.orderingUnit === orderingUnit);
    }

    return filtered;
  }, [ rows, selected, scope, orderingUnit, showPerformed, ]);

  // FIXED TYPESCRIPT ISSUE
  const orderingUnits = Array.from(
    new Set(
      rows
        .map(
          (r: any) => r.orderingUnit
        )
        .filter(
          (unit: any) => Boolean(unit)
        )
    )
  ) as string[];

  if (isLoading) {
    return (
      <div className="p-6">
        Loading sampling worklist...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-semibold">
          Sampling data
        </div>

        <div className="text-xs text-gray-500">
          Unit worklist
        </div>
      </div>

      {/* FILTER BAR */}
      <section className="rounded border border-gray-300 bg-white">
        <div className="flex flex-wrap items-center gap-3 px-3 py-2">
          <div className="text-[12px] font-semibold text-gray-700">
            View
          </div>

          <RadioGroup
            row
            value={scope}
            onChange={(e) =>
              setScope(
                e.target.value as
                  | "selected"
                  | "all"
              )
            }
          >
            <FormControlLabel
              value="selected"
              control={<Radio size="small" />}
              label="Selected patient"
            />

            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="All patients"
            />
          </RadioGroup>

          <TextField
            label="Ordering unit"
            size="small"
            select
            value={orderingUnit}
            onChange={(e) =>
              setOrderingUnit(
                e.target.value
              )
            }
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">
              All units
            </MenuItem>

            {orderingUnits.map((unit) => (
              <MenuItem
                key={unit}
                value={unit}
              >
                {unit}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={showPerformed}
                onChange={(e) =>
                  setShowPerformed(
                    e.target.checked
                  )
                }
              />
            }
            label="Show sent/performed"
          />

          <Button
            variant="outlined"
            size="small"
            onClick={() => refetch()}
          >
            Refresh
          </Button>

          <div className="ml-auto">
            <FormControlLabel
              control={
                <Checkbox
                  checked={showExtended}
                  onChange={(e) =>
                    setShowExtended(
                      e.target.checked
                    )
                  }
                />
              }
              label="Show extended information"
            />
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="grid gap-3 grid-cols-1 xl:grid-cols-[1fr_1fr_360px]">
        <SamplingWorklist
          rows={visibleRows}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <SamplingDetails sample={selected} />

        <SamplingActions
          sample={selected}
          showExtended={showExtended}
          onPrint={() =>
            setOpenPrint(true)
          }
        />
      </div>

      <PrintDialog
        open={openPrint}
        onClose={() =>
          setOpenPrint(false)
        }
        onConfirm={(opts) => {
          console.log(opts);

          setOpenPrint(false);
        }}
      />
    </div>
  );
};

export default SamplingDataPage;
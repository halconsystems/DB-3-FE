import { usePhases } from "./usePhases";

export function usePhaseOptions() {
  const { data: phases, isLoading, isError } = usePhases();
  const options = phases
    ? phases.map((phase) => ({ value: phase.id, label: phase.phaseName }))
    : [{ value: "", label: "Select here" }];
  return { options, isLoading, isError };
}

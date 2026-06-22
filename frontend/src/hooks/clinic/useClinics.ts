import { useQuery } from "@tanstack/react-query"
import { getClinics } from "../../api/clinic.api"

export const useClinic = () => {
    return useQuery ({
        queryKey: ['clinics'],
        queryFn: getClinics,
    })
}
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const PharmacyHeader = () => {
  return (
    <Box mb={3}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        Pharmacy
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
      >
        Medication & Inventory Management
      </Typography>
    </Box>
  );
};

export default PharmacyHeader;
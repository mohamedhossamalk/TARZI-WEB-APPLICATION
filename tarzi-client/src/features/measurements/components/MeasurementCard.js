// src/features/measurements/components/MeasurementCard.js
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StraightenOutlined as MeasureIcon
} from '@mui/icons-material';

const MeasurementCard = ({ measurement, onEdit, onDelete, onSetDefault }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenDetailsDialog = () => {
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  const handleDelete = () => {
    onDelete();
    handleCloseDeleteDialog();
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        ...(measurement.isDefault && {
          borderColor: 'primary.main',
          borderWidth: 2,
          borderStyle: 'solid'
        })
      }}>
        {measurement.isDefault && (
          <Chip
            icon={<StarIcon />}
            label="المقاس الافتراضي"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1
            }}
          />
        )}
        <CardContent sx={{ flexGrow: 1, pt: measurement.isDefault ? 5 : 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {measurement.name}
          </Typography>
          
          <Chip 
            label={`${measurement.unit === 'cm' ? 'سنتيمتر' : 'إنش'}`}
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                الطول
              </Typography>
              <Typography variant="body1">
                {measurement.height} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                الصدر
              </Typography>
              <Typography variant="body1">
                {measurement.chest} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                الخصر
              </Typography>
              <Typography variant="body1">
                {measurement.waist} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                الأرداف
              </Typography>
              <Typography variant="body1">
                {measurement.hips} {measurement.unit}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="text"
            color="primary"
            onClick={handleOpenDetailsDialog}
            fullWidth
            sx={{ mt: 2 }}
          >
            عرض كافة القياسات
          </Button>
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
          <Box>
            <IconButton 
              size="small" 
              color="primary" 
              onClick={onEdit}
              aria-label="تعديل"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              size="small" 
              color="error" 
              onClick={handleOpenDeleteDialog}
              aria-label="حذف"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          {!measurement.isDefault && (
            <Button
              startIcon={<StarBorderIcon />}
              size="small"
              onClick={onSetDefault}
              variant="outlined"
            >
              تعيين كافتراضي
            </Button>
          )}
        </CardActions>
      </Card>

      {/* حوار تأكيد الحذف */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من حذف مقاس "{measurement.name}"؟
            <br />
            هذا الإجراء لا يمكن التراجع عنه.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* حوار تفاصيل المقاس */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MeasureIcon sx={{ mr: 1 }} />
            تفاصيل مقاس "{measurement.name}"
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                الطول
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.height} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                الصدر
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.chest} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                الخصر
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.waist} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                الأرداف
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.hips} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                الكتف
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.shoulder} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                طول الكم
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.sleeve} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                طول الساق من الداخل
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.inseam} {measurement.unit}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                الرقبة
              </Typography>
              <Typography variant="body1" gutterBottom>
                {measurement.neck} {measurement.unit}
              </Typography>
            </Grid>
            
            {measurement.notes && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  ملاحظات
                </Typography>
                <Typography variant="body1">
                  {measurement.notes}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onEdit} color="primary" startIcon={<EditIcon />}>
            تعديل
          </Button>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MeasurementCard;
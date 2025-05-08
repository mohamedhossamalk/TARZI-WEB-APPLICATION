// src/features/cart/components/PaymentForm.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Paper,
  Divider
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Money as CashIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const PaymentForm = ({ onSubmit, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (paymentMethod === 'card') {
      // التحقق من بيانات البطاقة
      if (!cardName || !cardNumber || !expDate || !cvv) {
        alert('يرجى إدخال جميع بيانات البطاقة');
        return;
      }
      
      // التحقق من صحة رقم البطاقة (تنفيذ بسيط، يمكن استخدام مكتبات مثل card-validator للتحقق الدقيق)
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('يرجى إدخال رقم بطاقة صحيح (16 رقم)');
        return;
      }
    }
    
    // إرسال طريقة الدفع المحددة
    onSubmit(paymentMethod);
  };
  
  const handleCardNumberChange = (e) => {
    // تنسيق رقم البطاقة ليكون أكثر قابلية للقراءة (مثال: 1234 5678 9012 3456)
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      // إضافة مسافة بعد كل 4 أرقام
      setCardNumber(value.replace(/(\d{4})(?=\d)/g, '$1 ').trim());
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        طريقة الدفع
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <RadioGroup
            aria-label="payment-method"
            name="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Paper variant="outlined" sx={{ mb: 2, p: 2, border: paymentMethod === 'cod' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'cod' ? 'primary.main' : 'divider' }}>
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CashIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="body1">الدفع عند الاستلام</Typography>
                  </Box>
                }
              />
              {paymentMethod === 'cod' && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mr: 4 }}>
                  يمكنك الدفع نقداً عند استلام طلبك.
                </Typography>
              )}
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, border: paymentMethod === 'card' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'card' ? 'primary.main' : 'divider' }}>
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="body1">بطاقة ائتمان</Typography>
                  </Box>
                }
              />
              
              {paymentMethod === 'card' && (
                <Box sx={{ mt: 2, ml: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="cardName"
                        label="الاسم على البطاقة"
                        fullWidth
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="cardNumber"
                        label="رقم البطاقة"
                        fullWidth
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        inputProps={{ maxLength: 19 }}  // 16 أرقام + 3 مسافات
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        id="expDate"
                        label="تاريخ الانتهاء"
                        fullWidth
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                        placeholder="MM/YY"
                        inputProps={{ maxLength: 5 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        id="cvv"
                        label="رمز الأمان (CVV)"
                        fullWidth
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        inputProps={{ maxLength: 4 }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <LockIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      بياناتك مشفرة وآمنة مع نظام دفع آمن.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </RadioGroup>
        </FormControl>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={onBack}>
            رجوع
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            متابعة
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PaymentForm;
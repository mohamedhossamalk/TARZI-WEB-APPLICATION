import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  
  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      address: '123 شارع المثال',
      city: 'القاهرة',
      state: 'القاهرة',
      zip: '11511',
      country: 'مصر',
      isDefault: true
    }
  ]);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle personal info change
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Handle save personal info
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    console.log('Save personal info:', personalInfo);
    // Dispatch action to save personal info
  };
  
  // Handle save password
  const handleSavePassword = (e) => {
    e.preventDefault();
    console.log('Save password:', passwordData);
    // Dispatch action to change password
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('profile.title')}
        </Typography>
        
        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab label={t('profile.personalInfo')} id="profile-tab-0" />
            <Tab label={t('profile.addressBook')} id="profile-tab-1" />
            <Tab label={t('profile.passwordChange')} id="profile-tab-2" />
          </Tabs>
          
          {/* Personal Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleSavePersonalInfo}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="username"
                    label={t('auth.username')}
                    fullWidth
                    value={personalInfo.username}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label={t('auth.email')}
                    fullWidth
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                    type="email"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="phone"
                    label={t('auth.phone')}
                    fullWidth
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t('profile.save')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          
          {/* Address Book Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {t('profile.addAddress')}
              </Button>
            </Box>
            
            <Divider />
            
            <List>
              {addresses.map((address) => (
                <ListItem
                  key={address.id}
                  divider
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box>
                        {address.isDefault && (
                          <Typography variant="caption" color="primary">
                            {t('profile.defaultAddress')}
                          </Typography>
                        )}
                        <Typography variant="subtitle1">
                          {address.address}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {address.city}, {address.state}, {address.zip}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {address.country}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          
          {/* Change Password Tab */}
          <TabPanel value={tabValue} index={2}>
            <form onSubmit={handleSavePassword}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="currentPassword"
                    label={t('profile.currentPassword')}
                    fullWidth
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="newPassword"
                    label={t('profile.newPassword')}
                    fullWidth
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="confirmNewPassword"
                    label={t('profile.confirmNewPassword')}
                    fullWidth
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t('profile.save')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
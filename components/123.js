import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';

const DevOpsPortalLogin = () => {
  const [formMode, setFormMode] = useState('login'); // 'login', 'create', 'edit'
  const [username, setUsername] = useState('artemm');
  const [password, setPassword] = useState('********');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);
  const [accountSwitcherVisible, setAccountSwitcherVisible] = useState(false);
  
  // Create/Edit account form state
  const [accountFormData, setAccountFormData] = useState({
    id: null,
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
  });
  
  // Sample saved accounts
  const [savedAccounts, setSavedAccounts] = useState([
    { id: '1', username: 'artemm', email: 'artemm@example.com', fullName: 'Artem Myanov', lastLogin: '2 hours ago' },
    { id: '2', username: 'john.doe', email: 'john@example.com', fullName: 'John Doe', lastLogin: 'Yesterday' },
    { id: '3', username: 'jane.smith', email: 'jane@example.com', fullName: 'Jane Smith', lastLogin: '3 days ago' },
  ]);

  const switchAccount = (accountUsername) => {
    setUsername(accountUsername);
    setPassword('');
    setAccountSwitcherVisible(false);
  };

  const handleCreateAccount = () => {
    // Validate form
    if (!accountFormData.username || !accountFormData.password || !accountFormData.confirmPassword || 
        !accountFormData.email || !accountFormData.fullName) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    
    if (accountFormData.password !== accountFormData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Add new account to saved accounts
    const newAccount = {
      id: String(savedAccounts.length + 1),
      username: accountFormData.username,
      email: accountFormData.email,
      fullName: accountFormData.fullName,
      lastLogin: 'Just now',
    };
    
    setSavedAccounts([...savedAccounts, newAccount]);
    
    // Switch to this account
    setUsername(accountFormData.username);
    setPassword(accountFormData.password);
    
    // Reset form and go back to login
    resetAccountForm();
    setFormMode('login');
    Alert.alert('Success', 'Account created successfully');
  };

  const handleEditAccount = () => {
    // Validate form
    if (!accountFormData.username || !accountFormData.email || !accountFormData.fullName) {
      Alert.alert('Error', 'Username, email, and full name are required');
      return;
    }
    
    if (accountFormData.password && accountFormData.password !== accountFormData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Update the account in saved accounts
    const updatedAccounts = savedAccounts.map(account => {
      if (account.id === accountFormData.id) {
        return {
          ...account,
          username: accountFormData.username,
          email: accountFormData.email,
          fullName: accountFormData.fullName,
        };
      }
      return account;
    });
    
    setSavedAccounts(updatedAccounts);
    
    // Update login info if currently selected account
    if (username === accountFormData.username) {
      setUsername(accountFormData.username);
      if (accountFormData.password) {
        setPassword(accountFormData.password);
      }
    }
    
    // Reset form and go back to login
    resetAccountForm();
    setFormMode('login');
    Alert.alert('Success', 'Account updated successfully');
  };
  
  const startEditAccount = (accountId) => {
    const account = savedAccounts.find(acc => acc.id === accountId);
    if (account) {
      setAccountFormData({
        id: account.id,
        username: account.username,
        password: '',
        confirmPassword: '',
        email: account.email,
        fullName: account.fullName,
      });
      setFormMode('edit');
      setAccountSwitcherVisible(false);
    }
  };
  
  const resetAccountForm = () => {
    setAccountFormData({
      id: null,
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: '',
    });
  };

  const renderAccountItem = ({ item }) => (
    <View style={styles.accountItem}>
      <TouchableOpacity 
        style={styles.accountSelectArea}
        onPress={() => switchAccount(item.username)}
      >
        <View style={styles.accountAvatar}>
          <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountUsername}>{item.username}</Text>
          <Text style={styles.accountName}>{item.fullName}</Text>
          <Text style={styles.accountLastLogin}>Last login: {item.lastLogin}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.editAccountButton}
        onPress={() => startEditAccount(item.id)}
      >
        <Text style={styles.editAccountText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />
        <TouchableOpacity 
          style={styles.switchAccountButton}
          onPress={() => setAccountSwitcherVisible(true)}
        >
          <Text style={styles.switchAccountText}>Switch</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />
      
      {/* Remember Me */}
      <View style={styles.rememberContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRememberMe(!rememberMe)}
        >
          {rememberMe && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.rememberText}>Remember me</Text>
        
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      
      {/* Login Button */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Login</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>
      
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Enter a userid</Text>
        </View>
      )}
      
      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>
      
      {/* External Login */}
      <TouchableOpacity style={styles.externalLoginButton}>
        <Text style={styles.externalLoginText}>External Login</Text>
        <View style={styles.ssoContainer}>
          <Text style={styles.ssoText}>Pantheon SSO</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderCreateAccountForm = () => (
    <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContentContainer}>
      <Text style={styles.formLabel}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.fullName}
        onChangeText={(text) => setAccountFormData({...accountFormData, fullName: text})}
        placeholder="Enter your full name"
      />
      
      <Text style={styles.formLabel}>Email</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.email}
        onChangeText={(text) => setAccountFormData({...accountFormData, email: text})}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      
      <Text style={styles.formLabel}>Username</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.username}
        onChangeText={(text) => setAccountFormData({...accountFormData, username: text})}
        placeholder="Choose a username"
      />
      
      <Text style={styles.formLabel}>Password</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.password}
        onChangeText={(text) => setAccountFormData({...accountFormData, password: text})}
        secureTextEntry
        placeholder="Choose a password"
      />
      
      <Text style={styles.formLabel}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.confirmPassword}
        onChangeText={(text) => setAccountFormData({...accountFormData, confirmPassword: text})}
        secureTextEntry
        placeholder="Confirm your password"
      />
      
      <Text style={styles.passwordRequirements}>
        Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
      </Text>
      
      <View style={styles.formButtonsContainer}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => {
            resetAccountForm();
            setFormMode('login');
          }}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderEditAccountForm = () => (
    <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContentContainer}>
      <Text style={styles.formHeading}>Edit Account</Text>
      
      <Text style={styles.formLabel}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.fullName}
        onChangeText={(text) => setAccountFormData({...accountFormData, fullName: text})}
        placeholder="Enter your full name"
      />
      
      <Text style={styles.formLabel}>Email</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.email}
        onChangeText={(text) => setAccountFormData({...accountFormData, email: text})}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      
      <Text style={styles.formLabel}>Username</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.username}
        onChangeText={(text) => setAccountFormData({...accountFormData, username: text})}
        placeholder="Choose a username"
      />
      
      <Text style={styles.formLabel}>New Password (optional)</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.password}
        onChangeText={(text) => setAccountFormData({...accountFormData, password: text})}
        secureTextEntry
        placeholder="Leave blank to keep current password"
      />
      
      <Text style={styles.formLabel}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={accountFormData.confirmPassword}
        onChangeText={(text) => setAccountFormData({...accountFormData, confirmPassword: text})}
        secureTextEntry
        placeholder="Confirm your new password"
      />
      
      <View style={styles.formButtonsContainer}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => {
            resetAccountForm();
            setFormMode('login');
          }}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleEditAccount}
        >
          <Text style={styles.primaryButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header with Background Image */}
      <ImageBackground 
        source={require('../assets/loginBG_01.jpg')} 
        style={styles.header}
      >
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>VERSION 19.3.5-SNAPSHOT</Text>
        </View>
        <Text style={styles.headerTitle}>DevOps Portal</Text>
      </ImageBackground>
      
      {/* Login Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../assets/pantheon-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Mode Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, formMode === 'login' && styles.activeToggle]}
            onPress={() => setFormMode('login')}
          >
            <Text style={[styles.toggleText, formMode === 'login' && styles.activeToggleText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, formMode === 'create' && styles.activeToggle]}
            onPress={() => {
              resetAccountForm();
              setFormMode('create');
            }}
          >
            <Text style={[styles.toggleText, formMode === 'create' && styles.activeToggleText]}>Create Account</Text>
          </TouchableOpacity>
        </View>
        
        {/* Dynamic Form Content */}
        {formMode === 'login' && renderLoginForm()}
        {formMode === 'create' && renderCreateAccountForm()}
        {formMode === 'edit' && renderEditAccountForm()}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.poweredBy}>Powered by</Text>
          <Image 
            source={require('../assets/odyssey-logo.png')}
            style={styles.odysseyLogo}
            resizeMode="contain"
          />
          <Text style={styles.copyright}>© 1997-2025 Pantheon Inc. All rights reserved.</Text>
        </View>
      </View>

      {/* Account Switcher Modal */}
      <Modal
        visible={accountSwitcherVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAccountSwitcherVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Accounts</Text>
              <TouchableOpacity onPress={() => setAccountSwitcherVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={savedAccounts}
              renderItem={renderAccountItem}
              keyExtractor={item => item.id}
              style={styles.accountList}
            />
            
            <TouchableOpacity 
              style={styles.addAccountButton}
              onPress={() => {
                setUsername('');
                setPassword('');
                setAccountSwitcherVisible(false);
              }}
            >
              <Text style={styles.addAccountText}>+ Use a different account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.createAccountButton}
              onPress={() => {
                resetAccountForm();
                setFormMode('create');
                setAccountSwitcherVisible(false);
              }}
            >
              <Text style={styles.createAccountText}>Create new account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  versionContainer: {
    backgroundColor: '#E51F30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  versionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 50,
    marginVertical: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E51F30',
    overflow: 'hidden',
  },
  toggleButton: {
    padding: 10,
    width: 150,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#E51F30',
  },
  toggleText: {
    color: '#E51F30',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#fff',
  },
  odysseyLogo: {
    width: 120,
    height: 30,
    marginVertical: 5,
  },
  formContainer: {
    width: '100%',
    maxWidth: 380,
  },
  formContentContainer: {
    paddingBottom: 20,
  },
  formHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  switchAccountButton: {
    marginLeft: 10,
    padding: 5,
  },
  switchAccountText: {
    color: '#0055AA',
    fontWeight: '500',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#E51F30',
    borderRadius: 10,
  },
  rememberText: {
    color: '#333',
    flex: 1,
  },
  forgotPasswordButton: {
    paddingVertical: 5,
  },
  forgotPasswordText: {
    color: '#0055AA',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#E51F30',
    height: 40,
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginRight: 10,
    flex: 1,
  },
  secondaryButtonText: {
    color: '#333',
  },
  formButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  arrowIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginTop: 15,
    borderRadius: 3,
  },
  errorIcon: {
    marginRight: 10,
  },
  errorText: {
    color: '#E51F30',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#999',
  },
  externalLoginButton: {
    borderWidth: 1,
    borderColor: '#E51F30',
    borderRadius: 3,
  },
  externalLoginText: {
    color: '#E51F30',
    padding: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ssoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  ssoText: {
    color: '#333',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  poweredBy: {
    color: '#666',
    fontSize: 12,
  },
  copyright: {
    color: '#999',
    fontSize: 10,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    maxWidth: 350,
    borderRadius: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  accountList: {
    maxHeight: 300,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accountSelectArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0055AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  accountInfo: {
    flex: 1,
  },
  accountUsername: {
    fontWeight: '500',
    fontSize: 14,
  },
  accountName: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  accountLastLogin: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
  editAccountButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editAccountText: {
    color: '#0055AA',
    fontWeight: '500',
  },
  addAccountButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addAccountText: {
    color: '#0055AA',
    fontWeight: '500',
  },
  createAccountButton: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#E51F30',
  },
  createAccountText: {
    color: '#fff',
    fontWeight: '500',
  },
  formLabel: {
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    marginTop: 5,
  },
});

export default DevOpsPortalLogin;
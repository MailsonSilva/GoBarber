import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0px 30px ${Platform.OS === 'android' ? 100 : 40}px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 15px;
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const UserAvatar = styled.Image`
  width: 176px;
  height: 176px;
  border-radius: 90px;
  margin-top: 26px;
  align-self: center;
`;

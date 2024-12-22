import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'user' && password === 'password') {
      navigation.navigate('Posts');
    }
  };

  return (
      <View style={styles.container}>
        <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
        />
        <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
  );
};

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts').then(response => setPosts(response.data));
  }, []);

  return (
      <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('PostDetails', { postId: item.id })}>
                <View style={styles.postItem}>
                  <Text style={styles.postTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
          )}
      />
  );
};

const PostDetailsScreen = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(response => setPost(response.data));
    axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`).then(response => setComments(response.data));
  }, [postId]);

  return (
      <View style={styles.container}>
        {post && (
            <>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text>{post.body}</Text>
            </>
        )}
        <FlatList
            data={comments}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentName}>{item.name}</Text>
                  <Text>{item.body}</Text>
                </View>
            )}
        />
      </View>
  );
};

const App = () => (
    <NavigationContainer>
      <Stack.Navigator id='stack'>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Posts" component={PostsScreen} />
        <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  postItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  postTitle: {
    fontWeight: 'bold',
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  commentName: {
    fontWeight: 'bold',
  },
});

export default App;

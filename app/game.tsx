import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Header from "../components/Header";
import TaskModal from "../components/TaskModal";

const { width, height } = Dimensions.get("window");

export default class Game extends React.Component {
  state = {
    todos: [
      { title: "앱 개발 완료하기", done: false, id: 1 },
      { title: "운전면허 도로주행 연수", done: false, id: 2 },
      { title: "엄마 밥 먹기", done: false, id: 3 },
    ],
    showModal: false,
    points: 0,
    animations: [],
  };

  componentDidMount() {
    this.initializeAnimations();
  }

  initializeAnimations = () => {
    const animations = this.state.todos.map(() => ({
      moveX: new Animated.Value(Math.random() * (width - 100)),
      moveY: new Animated.Value(Math.random() * (height - 200)),
      scale: new Animated.Value(1), // 크기 애니메이션
      opacity: new Animated.Value(1), // 투명도 애니메이션
      directionX: Math.random() < 0.5 ? -1 : 1,
      directionY: Math.random() < 0.5 ? -1 : 1,
      speed: Math.random() * 1000 + 1000,
    }));

    this.setState({ animations }, this.startAnimations);
  };

  startAnimations = () => {
    this.state.animations.forEach((animation) => {
      const loopAnimation = () => {
        Animated.sequence([
          Animated.timing(animation.moveX, {
            toValue: Math.max(
              0,
              Math.min(
                width - 100,
                animation.moveX.__getValue() + animation.directionX * 100
              )
            ),
            duration: animation.speed,
            useNativeDriver: true,
          }),
          Animated.timing(animation.moveY, {
            toValue: Math.max(
              0,
              Math.min(
                height - 200,
                animation.moveY.__getValue() + animation.directionY * 100
              )
            ),
            duration: animation.speed,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (
            animation.moveX.__getValue() <= 0 ||
            animation.moveX.__getValue() >= width - 100
          ) {
            animation.directionX = -animation.directionX;
          }
          if (
            animation.moveY.__getValue() <= 0 ||
            animation.moveY.__getValue() >= height - 200
          ) {
            animation.directionY = -animation.directionY;
          }
          loopAnimation();
        });
      };
      loopAnimation();
    });
  };

  explodeTodo = (id, index) => {
    const { animations, todos, points } = this.state;

    // 애니메이션 실행: 크기와 투명도를 조정
    Animated.parallel([
      Animated.timing(animations[index].scale, {
        toValue: 3, // 크기 3배
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index].opacity, {
        toValue: 0, // 투명도 0
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후 항목 삭제
      this.setState({
        todos: todos.filter((todo) => todo.id !== id),
        animations: animations.filter((_, i) => i !== index),
        points: points + 10, // 포인트 추가
      });
    });
  };

  addTask = (title) => {
    const newTodo = {
      title,
      done: false,
      id: this.state.todos.length + 1,
    };

    const newAnimation = {
      moveX: new Animated.Value(Math.random() * (width - 100)),
      moveY: new Animated.Value(Math.random() * (height - 200)),
      scale: new Animated.Value(1), // 초기 크기
      opacity: new Animated.Value(1), // 초기 투명도
      directionX: Math.random() < 0.5 ? -1 : 1,
      directionY: Math.random() < 0.5 ? -1 : 1,
      speed: Math.random() * 3000 + 2000,
    };

    this.setState(
      {
        todos: [...this.state.todos, newTodo],
        animations: [...this.state.animations, newAnimation],
      },
      () => {
        this.startAnimations();
      }
    );
  };

  resetGame = () => {
    this.setState({
      todos: [],
      points: 0,
      animations: [],
    });
  };

  renderCharacter = ({ item, index }) => {
    const animation = this.state.animations[index];
    if (!animation) return null;

    return (
      <Animated.View
        style={[
          styles.character,
          {
            transform: [
              { translateX: animation.moveX },
              { translateY: animation.moveY },
              { scale: animation.scale }, // 크기 애니메이션 적용
            ],
            opacity: animation.opacity, // 투명도 애니메이션 적용
          },
        ]}
      >
        <TouchableOpacity onPress={() => this.explodeTodo(item.id, index)}>
          <Text style={styles.characterText}>{item.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          show={() => {
            this.setState({ showModal: true });
          }}
        />
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>포인트: {this.state.points}</Text>
        </View>

        <FlatList
          data={this.state.todos}
          renderItem={this.renderCharacter}
          keyExtractor={(item) => `${item.id}`}
          contentContainerStyle={styles.listContainer}
        />

        <TaskModal
          isVisible={this.state.showModal}
          add={(title) => {
            this.addTask(title);
            this.setState({ showModal: false });
          }}
          hide={() => {
            this.setState({ showModal: false });
          }}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={this.resetGame}>
            <Text style={styles.resetButtonText}>RESET GAME</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={this.props.onBack}
          >
            <Text style={styles.backButtonText}>BACK TO TO-DO LIST</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0FF",
  },
  pointsContainer: {
    padding: 10,
    alignItems: "center",
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  character: {
    position: "absolute",
    backgroundColor: "#B19CD9",
    padding: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#9370DB",
  },
  characterText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  resetButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#9370DB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import React from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import TodoItem from "../components/TodoItem";
import TaskModal from "../components/TaskModal";
import Game from "./game";
import Quotes from "./quotes";
import { Calendar } from "react-native-calendars";
import { Image } from "react-native";

const API_KEY = "2e45dbdce2f8619be510b8ab0fe82f06"; // OpenWeather API 키
const WEATHER_API_URL =
  "https://api.openweathermap.org/data/2.5/weather?q=Seoul&units=metric&appid=";

export default class App extends React.Component {
  state = {
    todos: [
      { title: "운전면허 도로주행 연수", done: true },
      { title: "모바일 앱 개발 발표", done: false },
      { title: "과제 제출", done: false },
    ],
    diaries: {}, // 날짜별 다이어리 저장 객체
    showModal: false,
    showCalendar: false,
    diaryModal: false,
    showTimerModal: false,
    timerRunning: false,
    elapsedSeconds: 0, // 경과 시간 (초 단위)
    selectedDate: new Date().toISOString().split("T")[0], // 오늘 날짜
    diaryTitle: "",
    diaryContent: "",
    currentScreen: "TodoList",
    currentTime: new Date(), // 현재 시간
    weather: null, // 날씨 정보
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 60000);

    this.fetchWeather();
    this.loadData(); // 데이터 로드
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // 데이터 로드
  loadData = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      const savedDiaries = await AsyncStorage.getItem("diaries");

      if (savedTodos) {
        this.setState({ todos: JSON.parse(savedTodos) });
      }
      if (savedDiaries) {
        this.setState({ diaries: JSON.parse(savedDiaries) });
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  // To-Do 저장
  saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("To-Do 저장 실패:", error);
    }
  };

  // Diary 저장
  saveDiaries = async (diaries) => {
    try {
      await AsyncStorage.setItem("diaries", JSON.stringify(diaries));
    } catch (error) {
      console.error("Diary 저장 실패:", error);
    }
  };

  fetchWeather = async () => {
    try {
      const response = await fetch(WEATHER_API_URL + API_KEY);
      const data = await response.json();
      this.setState({
        weather: {
          temp: data.main.temp,
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        },
      });
    } catch (error) {
      console.error("날씨 정보 가져오기 실패:", error);
    }
  };

  toggleCalendar = () => {
    this.setState({ showCalendar: !this.state.showCalendar });
  };

  openDiaryModal = (date) => {
    const existingDiary = this.state.diaries[date] || {
      title: "",
      content: "",
    };
    this.setState({
      selectedDate: date,
      diaryModal: true,
      diaryTitle: existingDiary.title,
      diaryContent: existingDiary.content,
    });
  };

  saveDiary = () => {
    const { selectedDate, diaryTitle, diaryContent, diaries } = this.state;
    const updatedDiaries = {
      ...diaries,
      [selectedDate]: { title: diaryTitle, content: diaryContent },
    };
    this.setState({ diaries: updatedDiaries, diaryModal: false }, () =>
      this.saveDiaries(updatedDiaries)
    );
  };

  cancelDiary = () => {
    this.setState({
      diaryModal: false,
      diaryTitle: "",
      diaryContent: "",
    });
  };

  addTodo = (title) => {
    const newTodo = { title, done: false };
    const todos = [...this.state.todos, newTodo];
    this.setState({ todos }, () => this.saveTodos(todos));
  };

  toggleTodo = (index) => {
    const todos = [...this.state.todos];
    todos[index].done = !todos[index].done;
    this.setState({ todos }, () => this.saveTodos(todos));
  };

  removeTodo = (index) => {
    const todos = this.state.todos.filter((_, i) => i !== index);
    this.setState({ todos }, () => this.saveTodos(todos));
  };

  switchScreen = (screen) => {
    this.setState({ currentScreen: screen });
  };

  // 타이머 관련 함수
  startTimer = () => {
    if (this.state.timerRunning) return; // 이미 실행 중이면 실행 안 함
    this.setState({ timerRunning: true });
    this.timerInterval = setInterval(() => {
      this.setState((prevState) => ({
        elapsedSeconds: prevState.elapsedSeconds + 1,
      }));
    }, 1000);
  };

  stopTimer = () => {
    clearInterval(this.timerInterval);
    this.setState({ timerRunning: false });
  };

  resetTimer = () => {
    clearInterval(this.timerInterval);
    this.setState({ elapsedSeconds: 0, timerRunning: false });
  };

  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  renderTimerModal = () => (
    <Modal visible={this.state.showTimerModal} animationType="slide">
      <View style={styles.modalContainer}>
        {/* Timer Box */}
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>
            {this.formatTime(this.state.elapsedSeconds)}
          </Text>
          <View style={styles.timerButtons}>
            {!this.state.timerRunning ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={this.startTimer}
              >
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.stopButton}
                onPress={this.stopTimer}
              >
                <Text style={styles.buttonText}>Stop</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={this.resetTimer}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.setState({ showTimerModal: false })}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  renderTodoList() {
    const { currentTime, showCalendar, selectedDate, diaries, weather } =
      this.state;
    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header
          show={() => this.setState({ showModal: true })}
          openCalendar={this.toggleCalendar}
        />

        {/* Date and Time */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTimeText}>
            {formattedDate} {formattedTime}
          </Text>
          {weather && (
            <View style={styles.weatherBox}>
              <View style={styles.weatherContainer}>
                <Image
                  source={{ uri: weather.icon }}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherText}>
                  {`${weather.temp}°C - ${weather.description}`}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* To-Do List */}
        <FlatList
          data={this.state.todos}
          renderItem={({ item, index }) => (
            <TodoItem
              title={item.title}
              done={item.done}
              toggle={() => this.toggleTodo(index)}
              remove={() => this.removeTodo(index)}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => this.switchScreen("Game")}
          >
            <Text style={styles.navButtonText}>Play Game Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => this.switchScreen("Quotes")}
          >
            <Text style={styles.navButtonText}>Get Inspired</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => this.setState({ showTimerModal: true })}
          >
            <Text style={styles.navButtonText}>Study Timer</Text>
          </TouchableOpacity>
        </View>

        {/* Add Task Modal */}
        <TaskModal
          isVisible={this.state.showModal}
          add={(title) => {
            this.addTodo(title);
            this.setState({ showModal: false });
          }}
          hide={() => this.setState({ showModal: false })}
        />

        {/* Calendar Modal */}
        <Modal visible={showCalendar} animationType="slide">
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={(day) => this.openDiaryModal(day.dateString)}
              markedDates={{
                ...Object.keys(diaries).reduce((acc, date) => {
                  acc[date] = { marked: true, dotColor: "red" };
                  return acc;
                }, {}),
                [selectedDate]: { selected: true, selectedColor: "#8A6BE5" },
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this.toggleCalendar}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Diary Modal */}
        <Modal visible={this.state.diaryModal} animationType="slide">
          <View style={styles.diaryContainer}>
            <Text style={styles.diaryDateText}>{this.state.selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="제목"
              value={this.state.diaryTitle}
              onChangeText={(text) => this.setState({ diaryTitle: text })}
            />
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="내용을 입력하세요"
              value={this.state.diaryContent}
              multiline
              onChangeText={(text) => this.setState({ diaryContent: text })}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={this.saveDiary}
              >
                <Text style={styles.cancelButtonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={this.cancelDiary}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Timer Modal */}
        {this.renderTimerModal()}
      </SafeAreaView>
    );
  }

  renderGameScreen() {
    return <Game onBack={() => this.switchScreen("TodoList")} />;
  }

  renderQuotesScreen() {
    return <Quotes onBack={() => this.switchScreen("TodoList")} />;
  }

  render() {
    const { currentScreen } = this.state;

    if (currentScreen === "TodoList") {
      return this.renderTodoList();
    } else if (currentScreen === "Game") {
      return this.renderGameScreen();
    } else if (currentScreen === "Quotes") {
      return this.renderQuotesScreen();
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0FF" },
  dateTimeContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  dateTimeText: { fontSize: 18, color: "#4B0082", fontWeight: "600" },
  listContainer: { paddingBottom: 10, marginTop: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  navButton: { backgroundColor: "#8A6BE5", padding: 12, borderRadius: 8 },
  navButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  calendarContainer: { flex: 1, marginTop: 50, backgroundColor: "#FFF" },
  closeButton: { backgroundColor: "#8A6BE5", padding: 10, margin: 20 },
  closeButtonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  diaryContainer: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  diaryDateText: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  contentInput: { height: 150, textAlignVertical: "top" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#8A6BE5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  cancelButtonText: { color: "#FFF", fontWeight: "bold" },
  weatherContainer: {
    flexDirection: "row", // 가로 방향으로 정렬
    alignItems: "center", // 세로 방향으로 가운데 정렬
    justifyContent: "center", // 수평 방향으로 가운데 정렬
  },
  weatherIcon: { width: 50, height: 50, marginRight: 10 },
  weatherText: { fontSize: 18, color: "#6A1B9A", fontWeight: "600" },
  weatherBox: {
    backgroundColor: "#EDE7F6", // 배경색
    borderWidth: 1, // 테두리
    borderColor: "#F0F0FF",
    borderRadius: 12, // 둥근 테두리
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // 안드로이드 그림자
    alignItems: "center", // 가운데 정렬
    justifyContent: "center", // 수직 정렬
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4B0082",
    marginVertical: 20,
  },
  timerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%", // 버튼들이 한 줄에 배치되도록 컨테이너 폭 확보
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: "#8A6BE5",
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  timerBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
    width: "90%", // 화면 폭 기준으로 90% 사용
  },
});

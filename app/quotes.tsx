import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";

const quotes = [
  "성공은 준비와 기회의 만남이다. - 세네카",
  "할 수 있다고 믿는다면 이미 반은 이루어진 것이다. - 시어도어 루즈벨트",
  "어제보다 나은 오늘을 만들자.",
  "천 마일의 여행도 한 걸음부터 시작된다. - 노자",
  "작은 변화가 큰 성과를 만든다.",
  "당신의 시간은 한정되어 있다. 다른 사람의 인생을 살며 시간을 낭비하지 말라. - 스티브 잡스",
  "실패는 성공을 위한 기회이다. - 헨리 포드",
  "꿈을 꾸는 자만이 미래를 가진다. - 존 F. 케네디",
  "비록 천천히 걷더라도 멈추지만 않는다면 괜찮다. - 공자",
  "실패는 중요한 일의 일부이다. 실패를 통해 배우고 다시 도전하라. - 버락 오바마",
  "승리는 가장 끈기 있는 자의 것이다. - 나폴레옹 보나파르트",
  "오늘 걷지 않으면 내일은 뛰어야 한다.",
  "당신이 가야 할 길은 당신이 만드는 것이다.",
  "기회는 준비된 자에게만 찾아온다. - 파스퇴르",
  "성공은 마침내 해내는 것이 아니라 계속해서 해내는 것이다. - 오프라 윈프리",
  "나를 죽이지 못하는 것은 나를 더 강하게 만든다. - 니체",
  "시작하는 법을 배우면 성공은 이미 시작된 것이다. - 로버트 슐러",
  "지식보다 더 중요한 것은 상상력이다. - 알버트 아인슈타인",
  "좋은 일은 불편한 지점 밖에서 일어난다.",
  "항상 가능성을 믿고 도전하라.",
  "불가능은 노력하지 않는 자의 핑계이다.",
  "미래를 예측하는 가장 좋은 방법은 미래를 만드는 것이다. - 피터 드러커",
  "가장 큰 영광은 한 번도 실패하지 않는 것이 아니라, 실패할 때마다 일어나는 것이다. - 공자",
  "당신의 한계는 당신이 스스로 정한 것이다.",
  "지금 하는 작은 행동이 나중에 큰 변화를 만든다.",
  "노력 없이 성취된 것은 아무것도 없다. - 소포클레스",
  "성공하려면 당신이 무엇을 원하는지 명확하게 알아야 한다.",
  "매일 조금씩 나아지는 것이 결국 위대한 성공을 만든다.",
  "행동이 모든 성공의 기초이다. - 파블로 피카소",
  "성공이란 최선을 다하는 습관을 기르는 것이다.",
  "끝까지 포기하지 않는 사람만이 승리한다.",
  "당신의 꿈은 당신이 그것을 믿는 한 가능하다.",
  "아무리 멀리 떨어진 목표라도 한 걸음부터 시작하라.",
  "노력과 끈기만이 당신을 성장시킨다.",
];

export default class Quotes extends React.Component {
  state = {
    quote: this.getRandomQuote(),
    fadeAnim: new Animated.Value(0), // 애니메이션 값 초기화
  };

  // 무작위 명언 가져오기
  getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  componentDidMount() {
    this.fadeIn();
  }

  // 페이드인 애니메이션
  fadeIn = () => {
    this.state.fadeAnim.setValue(0);
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  refreshQuote = () => {
    this.setState({ quote: this.getRandomQuote() }, this.fadeIn);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[styles.quoteBox, { opacity: this.state.fadeAnim }]}
          >
            <Text style={styles.quoteText}>{this.state.quote}</Text>
          </Animated.View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.refreshQuote}>
              <Text style={styles.buttonText}>다른 명언 보기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.props.onBack}>
              <Text style={styles.buttonText}>Back to To-Do List</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA", // 라벤더 배경
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  quoteBox: {
    backgroundColor: "#fff", // 흰색 배경
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8, // 안드로이드 그림자
  },
  quoteText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B0082", // 인디고 색상
    textAlign: "center",
    lineHeight: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    width: "100%",
  },
  button: {
    backgroundColor: "#9370DB", // 미디엄 퍼플
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

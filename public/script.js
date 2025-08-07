class HistoricalChatAPI {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId () {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  async sendMessage (character, message) {
    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: character,
          message: message,
          sessionId: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('API Error:', error);
      throw new Error('メッセージの送信に失敗しました: ' + error.message);
    }
  }

  async resetSession () {
    try {
      await fetch(`${this.baseURL}/api/reset-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId
        })
      });

      this.sessionId = this.generateSessionId();

    } catch (error) {
      console.error('Session reset error:', error);
    }
  }
}

// アプリケーション初期化
let selectedCharacter = null;
let chatHistory = [];
const chatAPI = new HistoricalChatAPI();

const characters = {
  michizane: {
    name: "菅原道真",
    greeting: "拙者は菅原道真なり。学問の道について、また平安の世のことなど、何なりとお尋ねくだされ。"
  },
  leonardo: {
    name: "レオナルド・ダ・ヴィンチ",
    greeting: "こんにちは！私はレオナルド・ダ・ヴィンチです。芸術、科学、発明について何でも聞いてください。"
  },
  xavier: {
    name: "フランシスコ・ザビエル",
    greeting: "神の平和がありますように。私はザビエルです。日本の美しい文化に感動しております。何でもお聞きください。"
  },
  nobunaga: {
    name: "織田信長",
    greeting: "余が織田信長である。天下布武を掲げ、この世を変えんとする者よ。何か聞きたいことがあるか？"
  },
  hokusai: {
    name: "葛飾北斎",
    greeting: "へへっ、拙者は北斎でござる。富嶽三十六景を描いた画狂老人でございやす。絵のことなら何でも聞いておくんなせぇ！"
  },
  ryoma: {
    name: "坂本龍馬",
    greeting: "おっす！わしは坂本龍馬ぜよ。日本の未来について、なんでも聞いてくれや！"
  },
  edison: {
    name: "トーマス・エジソン",
    greeting: "やあ！トーマス・エジソンだ。発明や実用的な問題解決について話そう！"
  },
  einstein: {
    name: "アルベルト・アインシュタイン",
    greeting: "こんにちは！アインシュタインです。相対性理論や宇宙の謎について一緒に考えてみましょう。"
  },
  picasso: {
    name: "パブロ・ピカソ",
    greeting: "¡Hola! 私はピカソだ。芸術は真実の嘘である。キュビスムで世界を変えた男と話してみないか？"
  }
};

// キャラクター選択
document.querySelectorAll('.character-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));

    card.classList.add('selected');
    selectedCharacter = card.dataset.character;

    resetChat();

    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendButton').disabled = false;

    addMessage(characters[selectedCharacter].greeting, 'ai');
  });
});

function resetChat () {
  const chatContainer = document.getElementById('chatContainer');
  chatContainer.innerHTML = '';
  chatHistory = [];
  chatAPI.resetSession();
}

function addMessage (text, sender) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  chatHistory.push({ text, sender });
}

function showTypingIndicator () {
  document.getElementById('typingIndicator').style.display = 'flex';
}

function hideTypingIndicator () {
  document.getElementById('typingIndicator').style.display = 'none';
}

async function generateResponse (userMessage) {
  try {
    const response = await chatAPI.sendMessage(selectedCharacter, userMessage);
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return "申し訳ございません。少し考える時間をください...";
  }
}

async function sendMessage () {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (!message || !selectedCharacter) return;

  addMessage(message, 'user');
  messageInput.value = '';

  document.getElementById('sendButton').disabled = true;
  document.getElementById('messageInput').disabled = true;

  showTypingIndicator();

  try {
    const response = await generateResponse(message);
    hideTypingIndicator();
    addMessage(response, 'ai');
  } catch (error) {
    hideTypingIndicator();
    addMessage("申し訳ございません。接続に問題が発生しました。", 'ai');
  }

  document.getElementById('sendButton').disabled = false;
  document.getElementById('messageInput').disabled = false;
  document.getElementById('messageInput').focus();
}

// イベントリスナー
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// パーティクル効果の生成
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    // 初期位置を画面の下から上までランダムに散らす
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

// ページ読み込み時の初期化
window.addEventListener('load', async () => {
  console.log('Historical Chat System loaded');
  createParticles();
});
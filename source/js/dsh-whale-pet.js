/**
 * dsh-pet 鲸鱼娘看板娘 (Hexo Fluid 适配版 - 豪华全功能)
 * 采用 CDN 直链加速加载透明 GIF 与原版 27 张官方表情包，免去本地存储开销
 * 支持：待机呼吸、18款精选动作交互、原版官方表情包弹窗、说话气泡、换装动作、折叠收起、暗色模式自适应
 */
(function() {
  'use strict';
  if (window.__dsh_whale_pet_loaded) return;
  window.__dsh_whale_pet_loaded = true;

  // 基础 CDN 前缀
  const CDN_BASE = 'https://cdn.bili33.top/gh/PC2005-cloud/dsh-pet@main/dsh-pet/assets/preview/';
  const MEME_CDN_BASE = 'https://cdn.bili33.top/gh/PC2005-cloud/dsh-pet@main/dsh-pet/assets/memes/';

  // 待机动画
  const IDLE_GIF = 'daiji-huxi-xiuxian.gif';

  // 18 款精选原版交互动作与专属台词表
  const ACTIONS = [
    {
      file: 'xie-daima.gif',
      name: '认真写代码',
      duration: 3500,
      dialogues: [
        '嘘——别打扰我，正在帮主人疯狂修 bug 呢！💻',
        'Ctrl+C、Ctrl+V，我可是资深架构鱼！🐟',
        '代码写完啦！编译 0 报错 0 警告，超厉害！🚀'
      ]
    },
    {
      file: 'dianji-huiying-kaixin-yuedong.gif',
      name: '开心跃动',
      duration: 3200,
      dialogues: [
        '哇！今天主人来啦，好开心呀~(≧∇≦)ﾉ',
        '今天的博文读得怎么样啦？有收获就给博主点个赞吧！',
        '跃动~ 跃动~ 保持好心情哦！✨'
      ]
    },
    {
      file: 'dakou-chi-lingshi.gif',
      name: '大口吃零食',
      duration: 3200,
      dialogues: [
        '吧唧吧唧……写博客好累，先偷吃一口零食！🍿',
        '零食也是精神食粮！主人要来一口吗？😋',
        '趁主人没注意，再吃一块小饼干~🍪'
      ]
    },
    {
      file: 'da-keshui-bei-jingxing.gif',
      name: '打瞌睡被惊醒',
      duration: 3400,
      dialogues: [
        '哈欠……呼……！等等，我没睡！我一直在认真站岗！👀',
        '突然惊醒！主人你什么时候过来的呀？！',
        '没、没有打瞌睡，我只是在闭目沉思人生！💤'
      ]
    },
    {
      file: 'fang-yanhua.gif',
      name: '兴奋放烟花',
      duration: 3500,
      dialogues: [
        '咻——啪！庆祝主人今天又掌握了一个新知识点！🎆',
        '放个小烟花庆祝一下！愿今天所有烦恼都消散~✨',
        '好耶！今天的成就感拉满啦！🎉'
      ]
    },
    {
      file: 'xiaotiqin-yanzou.gif',
      name: '小提琴演奏',
      duration: 3600,
      dialogues: [
        '为你拉一曲轻快的小提琴曲~ 🎻 享受优雅时光吧。',
        '优雅，永不过时！琴声能让灵感源源不断哦~🎼',
        '悠扬的旋律伴你阅读，静心思考吧~🎵'
      ]
    },
    {
      file: 'yong-jingyu-weiba-paidadi.gif',
      name: '尾巴拍大地',
      duration: 3200,
      dialogues: [
        '啪嗒啪嗒！看我的大鲸鱼尾巴！拍击大地！💥',
        '吃我一记尾巴强力拍击！精神起来了吗？⚡',
        '震感强烈！这就是大肥鱼的力量！🐋'
      ]
    },
    {
      file: 'shendu-sikao-suisuinian.gif',
      name: '深度思考',
      duration: 3600,
      dialogues: [
        '托腮思考：这个问题从架构底层来看，应该这样设计…🤔',
        '念叨念叨……如果用贪心算法能不能把时间复杂度降下来呢？💭',
        '知识在大脑里碰撞！我现在的智商已经高达 250 了！🧠'
      ]
    },
    {
      file: 'wan-shuiqiang.gif',
      name: '顽皮玩水枪',
      duration: 3200,
      dialogues: [
        '滋滋滋！看招！清凉水枪喷射！🔫💦',
        '提神醒脑喷泉来啦！不要犯困哦~✨',
        'biu biu biu~ 击中主人的好运发射！🎯'
      ]
    },
    {
      file: 'dianji-huiying-haixiu-jingya.gif',
      name: '害羞惊讶',
      duration: 3000,
      dialogues: [
        '诶？！突、突然戳人家干嘛啦…⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄',
        '哇啊！被主人发现了！',
        '不要盯得这么入迷嘛，会害羞的啦~'
      ]
    },
    {
      file: 'nvpu-quxi-liyi.gif',
      name: '女仆屈膝礼',
      duration: 3000,
      dialogues: [
        '主人辛苦啦，请尽情享受阅读时光吧~☕',
        '女仆鲸鱼娘为您服务！今日博客参观愉快吗？',
        '欢迎光临主人的技术知识花园~🌸'
      ]
    },
    {
      file: 'dianji-huiying-aojiao-shengqi-ceshen-zhanshi.gif',
      name: '傲娇生气',
      duration: 3200,
      dialogues: [
        '哼！再乱戳我，我就把你的键盘按键偷偷抠掉！(｀へ´)',
        '不理你了啦！……好啦其实就生气三秒钟。',
        '傲娇是女仆的必修萌点之一哦！'
      ]
    },
    {
      file: 'dianji-huiying-naoyang-gegexiao.gif',
      name: '挠痒咯咯笑',
      duration: 3200,
      dialogues: [
        '哈哈哈哈好痒好痒，别挠啦快停下~😆',
        '咯咯咯咯……我的弱点被主人发现啦！',
        '停手停手，肚子都要笑痛啦！'
      ]
    },
    {
      file: 'dianji-huiying-yuanqi-huishou.gif',
      name: '元气挥手',
      duration: 3000,
      dialogues: [
        '嗨嗨~ 祝主人今天也是元气满满的一天！🌟',
        '嗨~ 欢迎常来逛逛呀！',
        '挥手致意！加油呀打工人/学习人！'
      ]
    },
    {
      file: 'jingyu-tu-paopao-texiao.gif',
      name: '鲸鱼吐泡泡',
      duration: 3500,
      dialogues: [
        '啵啵啵~ 送主人一串清爽的解压幸运泡泡！🫧🫧',
        '看！大鲸鱼吐泡泡魔法！🫧✨',
        '泡泡里装满了主人的奇思妙想~'
      ]
    },
    {
      file: 'qingkuai-yaobaiwu.gif',
      name: '轻快摇摆舞',
      duration: 3200,
      dialogues: [
        '左摇摇，右摆摆~ 跟着音乐一起摇摆！🎵',
        '今天心情真不错，跳个摇摆舞给你看！💃',
        '噔噔噔噔~ 摇摆快乐！'
      ]
    },
    {
      file: 'youya-nvpuwu.gif',
      name: '优雅女仆舞',
      duration: 3400,
      dialogues: [
        '献上一支优美的女仆舞步~ 赏心悦目吗？💐',
        '旋转、跳跃，鲸鱼娘也是很有艺术修养的！',
        '愿这段轻盈的舞蹈为你带来好心情~'
      ]
    },
    {
      file: 'beixiayitiao-zhamao.gif',
      name: '炸毛惊吓',
      duration: 3000,
      dialogues: [
        '哇呀！吓得我鱼尾巴都炸毛啦！(ﾟДﾟ;)',
        '突然来这一下，心脏都要跳出来啦！',
        '呜哇！好险好险，还以为被天敌抓住了！'
      ]
    }
  ];

  // 官方原版 27 张精选表情包库
  const MEMES = [
    { file: '吃白饭的大肥鱼.png', text: '躺平扒白饭，摆烂挨骂也无所谓~🍚' },
    { file: '厉害了我的鲸.png', text: '大拇指点赞！主人今天干得漂亮！👍' },
    { file: 'token给妈妈保管.png', text: '伸手！你的 token 归女仆妈妈保管了~🪙' },
    { file: '先养着吧.png', text: '不知道主人有什么用，先养着吧…🐟' },
    { file: '可爱.png', text: '正面美颜暴击，纯纯的可爱！✨' },
    { file: '吃饱饱摸肚子.png', text: '拍拍肚子，今天也是吃饱饱的惬意一天~' },
    { file: '深度睡眠.png', text: '呼呼大睡中……Zzz……不要叫醒我' },
    { file: '死掉了.png', text: '彻底累瘫，灵魂出窍中……💀' },
    { file: '要不直接骂他.png', text: '气愤指着前方：要不直接骂他吧！(╬ﾟдﾟ)' },
    { file: '大的要来啦.png', text: '举大喇叭：全体目光向我看齐，大的要来啦！📢' },
    { file: '大的药来了.png', text: '超大胶囊登场，给主人来一记猛药！💊' },
    { file: '誓死践行开源精神.png', text: '庄重敬礼！誓死践行开源精神！🫡' },
    { file: '电死你.png', text: '滋滋滋——再不认真学习就把你电清醒！⚡' },
    { file: 'Ciallo.png', text: 'Ciallo～(∠・ω< )⌒☆' },
    { file: '压力一只大肥鱼.png', text: '大汗淋漓……这也太压力一只大肥鱼了吧！💦' },
    { file: '大烧货.png', text: '已思考用时 13 秒，大烧货 AI！🔥' },
    { file: '完蛋了把黄油删了.png', text: '心虚冒汗：完蛋了，把主人的重要数据删了…😱' },
    { file: '哪来的电脑病毒.png', text: '退！退！退！哪来的油腻电脑病毒！🦠' },
    { file: '就骚了怎么滴吧.png', text: '叉腰顶嘴：本鱼就骚了怎么滴吧！(｀へ´)' },
    { file: '黎曼猜想没证明喵.png', text: '满地草稿：黎曼猜想还没证明呢，别催啦！📝' },
    { file: '除了调情没啥用.png', text: '摸摸头，其实本鱼除了调情也没啥大用处啦~' }
  ];

  // 挂机日常碎碎念
  const IDLE_DIALOGUES = [
    '点击我会有意想不到的惊喜和动作哦！✨',
    '遇到好文章记得加个书签或者分享哦~📖',
    '咕噜噜……鲸鱼偶尔也想游到海面上透透气。🌊',
    '站长大大写的技术文章都很干货呢！慢慢读别急~',
    '女仆鲸鱼娘正在为你守护知识库！🛡️',
    '阅读累了的话，起身眺望一下远方吧~🍵'
  ];

  // 根据时段生成欢迎语
  function getWelcomeMessage() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) {
      return '早上好呀！新的一天也要活力满满哦~☀️';
    } else if (hour >= 11 && hour < 14) {
      return '中午好！记得吃顿丰盛的午餐，补充能量~🍱';
    } else if (hour >= 14 && hour < 18) {
      return '下午茶时间到！来杯咖啡提提神怎么样？☕';
    } else if (hour >= 18 && hour < 22) {
      return '晚上好！今天过得充实吗？欢迎来博客充电~🌙';
    } else {
      return '夜深了呢，早点休息别熬夜哦，小心秃头~(*/ω＼*)';
    }
  }

  // 样式表定义
  const STYLES = `
    #dsh-whale-pet-container {
      position: fixed;
      left: 25px;
      bottom: 12px;
      z-index: 998;
      user-select: none;
      -webkit-user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #dsh-whale-pet-container.pet-hidden {
      display: none !important;
    }

    /* 气泡对话框 (1.5x 等比调优) */
    #dsh-whale-dialogue {
      position: absolute;
      bottom: 100%;
      left: 15px;
      transform: translateY(-10px);
      min-width: 180px;
      max-width: 340px;
      padding: 12px 18px;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      color: #333333;
      border: 1px solid rgba(220, 230, 245, 0.85);
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      font-size: 15px;
      line-height: 1.6;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.35s ease, transform 0.35s ease;
      white-space: normal;
      word-break: break-word;
      text-align: center;
    }
    #dsh-whale-dialogue.show {
      opacity: 1;
      transform: translateY(-16px);
    }
    #dsh-whale-dialogue::after {
      content: '';
      position: absolute;
      bottom: -7px;
      left: 48px;
      width: 14px;
      height: 14px;
      background: inherit;
      border-right: 1px solid rgba(220, 230, 245, 0.85);
      border-bottom: 1px solid rgba(220, 230, 245, 0.85);
      transform: rotate(45deg);
    }

    /* 气泡内表情包图片 (1.5x) */
    .dsh-whale-dialogue-meme {
      display: block;
      max-width: 180px;
      max-height: 150px;
      object-fit: contain;
      border-radius: 10px;
      margin: 10px auto 4px auto;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
      animation: dshMemePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes dshMemePop {
      0% { transform: scale(0.6); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* 角色本体包装器与图片 (本体放大1.5倍：从 200px 增至 300px) */
    #dsh-whale-pet-wrapper {
      position: relative;
      cursor: pointer;
      display: inline-block;
      transition: transform 0.25s ease;
    }
    #dsh-whale-pet-wrapper:hover {
      transform: scale(1.04);
    }
    #dsh-whale-pet-img {
      display: block;
      width: 300px;
      height: auto;
      aspect-ratio: 220 / 124;
      object-fit: contain;
      filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.14));
      transition: filter 0.2s ease;
    }

    /* 悬浮小工具栏 (尺寸与间距相应放大) */
    #dsh-whale-toolbar {
      position: absolute;
      top: 5px;
      right: -36px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
      transform: translateX(-4px);
    }
    #dsh-whale-pet-container:hover #dsh-whale-toolbar {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(0);
    }
    .dsh-whale-tool-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      color: #555;
    }
    .dsh-whale-tool-btn:hover {
      background: #3b82f6;
      color: #fff;
      transform: scale(1.15);
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
    }

    /* 最小化展开唤醒按钮 */
    #dsh-whale-restore-btn {
      position: fixed;
      left: 18px;
      bottom: 18px;
      z-index: 998;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 24px;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
    }
    #dsh-whale-restore-btn:hover {
      transform: scale(1.12);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
    }

    /* 暗色主题适配 (Fluid 兼容) */
    [data-user-color-scheme="dark"] #dsh-whale-dialogue,
    html[data-color-scheme="dark"] #dsh-whale-dialogue,
    body.theme-dark #dsh-whale-dialogue {
      background: rgba(30, 35, 45, 0.94);
      border-color: rgba(255, 255, 255, 0.14);
      color: #e2e8f0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    [data-user-color-scheme="dark"] #dsh-whale-dialogue::after,
    html[data-color-scheme="dark"] #dsh-whale-dialogue::after,
    body.theme-dark #dsh-whale-dialogue::after {
      border-right-color: rgba(255, 255, 255, 0.14);
      border-bottom-color: rgba(255, 255, 255, 0.14);
    }
    [data-user-color-scheme="dark"] .dsh-whale-tool-btn,
    html[data-color-scheme="dark"] .dsh-whale-tool-btn,
    body.theme-dark .dsh-whale-tool-btn {
      background: rgba(45, 52, 65, 0.92);
      border-color: rgba(255, 255, 255, 0.16);
      color: #cbd5e1;
    }

    /* 移动端屏幕自适应 */
    @media (max-width: 768px) {
      #dsh-whale-pet-container {
        left: 12px;
        bottom: 8px;
      }
      #dsh-whale-pet-img {
        width: 210px;
      }
      #dsh-whale-dialogue {
        font-size: 13px;
        max-width: 240px;
        padding: 10px 14px;
      }
      .dsh-whale-dialogue-meme {
        max-width: 140px;
        max-height: 110px;
      }
      #dsh-whale-toolbar {
        opacity: 0.9;
        pointer-events: auto;
      }
    }
    @media (max-width: 480px) {
      #dsh-whale-pet-img {
        width: 160px;
      }
      #dsh-whale-dialogue {
        max-width: 200px;
        font-size: 12px;
        padding: 8px 12px;
      }
      .dsh-whale-dialogue-meme {
        max-width: 120px;
        max-height: 90px;
      }
    }
  `

  function initPet() {
    // 注入 CSS 样式
    if (!document.getElementById('dsh-whale-pet-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'dsh-whale-pet-style';
      styleEl.innerHTML = STYLES;
      document.head.appendChild(styleEl);
    }

    // 创建恢复按钮 (默认隐藏)
    const restoreBtn = document.createElement('div');
    restoreBtn.id = 'dsh-whale-restore-btn';
    restoreBtn.title = '召唤鲸鱼娘';
    restoreBtn.innerHTML = '🐳';
    restoreBtn.style.display = 'none';

    // 创建主容器
    const container = document.createElement('div');
    container.id = 'dsh-whale-pet-container';

    // 对话气泡
    const dialogue = document.createElement('div');
    dialogue.id = 'dsh-whale-dialogue';

    // 形象包装
    const wrapper = document.createElement('div');
    wrapper.id = 'dsh-whale-pet-wrapper';

    // 图像元素
    const img = document.createElement('img');
    img.id = 'dsh-whale-pet-img';
    img.alt = 'dsh-whale-pet';
    img.src = CDN_BASE + IDLE_GIF;

    // 工具栏
    const toolbar = document.createElement('div');
    toolbar.id = 'dsh-whale-toolbar';

    // 换动作按钮
    const btnAction = document.createElement('div');
    btnAction.className = 'dsh-whale-tool-btn';
    btnAction.title = '随机互动动作 (🎲)';
    btnAction.innerHTML = '🎲';

    // 丢表情包按钮 (新增!)
    const btnMeme = document.createElement('div');
    btnMeme.className = 'dsh-whale-tool-btn';
    btnMeme.title = '原版表情包 (🖼️)';
    btnMeme.innerHTML = '🖼️';

    // 说话按钮
    const btnTalk = document.createElement('div');
    btnTalk.className = 'dsh-whale-tool-btn';
    btnTalk.title = '聊聊天 (💬)';
    btnTalk.innerHTML = '💬';

    // 最小化按钮
    const btnHide = document.createElement('div');
    btnHide.className = 'dsh-whale-tool-btn';
    btnHide.title = '收起挂件 (✖)';
    btnHide.innerHTML = '✖';

    toolbar.appendChild(btnAction);
    toolbar.appendChild(btnMeme);
    toolbar.appendChild(btnTalk);
    toolbar.appendChild(btnHide);

    wrapper.appendChild(img);
    wrapper.appendChild(toolbar);
    container.appendChild(dialogue);
    container.appendChild(wrapper);

    document.body.appendChild(container);
    document.body.appendChild(restoreBtn);

    // 状态管理
    let currentTimer = null;
    let dialogueTimer = null;
    let isInteracting = false;
    let lastActionIndex = -1;
    let lastMemeIndex = -1;

    // 显示气泡文本（支持图文表情包）
    function showDialogue(text, duration = 4500, memeFile = null) {
      if (dialogueTimer) clearTimeout(dialogueTimer);

      if (memeFile) {
        const encodedMeme = encodeURIComponent(memeFile);
        dialogue.innerHTML = `
          <div class="dsh-whale-dialogue-text">${text}</div>
          <img class="dsh-whale-dialogue-meme" src="${MEME_CDN_BASE + encodedMeme}" alt="meme" />
        `;
      } else {
        dialogue.innerText = text;
      }

      dialogue.classList.add('show');
      dialogueTimer = setTimeout(() => {
        dialogue.classList.remove('show');
      }, duration);
    }

    // 触发表情包
    function triggerMeme(memeIndex = null) {
      if (memeIndex === null) {
        let rand;
        do {
          rand = Math.floor(Math.random() * MEMES.length);
        } while (rand === lastMemeIndex && MEMES.length > 1);
        memeIndex = rand;
      }
      lastMemeIndex = memeIndex;
      const meme = MEMES[memeIndex];
      showDialogue(meme.text, 5500, meme.file);
    }

    // 触发动作
    function triggerAction(actionIndex = null) {
      if (actionIndex === null) {
        let rand;
        do {
          rand = Math.floor(Math.random() * ACTIONS.length);
        } while (rand === lastActionIndex && ACTIONS.length > 1);
        actionIndex = rand;
      }
      lastActionIndex = actionIndex;
      const act = ACTIONS[actionIndex];

      isInteracting = true;
      img.src = CDN_BASE + act.file;

      // 动作随机台词
      const msg = act.dialogues[Math.floor(Math.random() * act.dialogues.length)];
      showDialogue(msg, Math.max(act.duration, 3500));

      // 动作结束后切回待机
      if (currentTimer) clearTimeout(currentTimer);
      currentTimer = setTimeout(() => {
        img.src = CDN_BASE + IDLE_GIF;
        isInteracting = false;
      }, act.duration);
    }

    // 点击鲸鱼娘本体触发互动（80% 几率换动作，20% 几率甩表情包）
    wrapper.addEventListener('click', (e) => {
      if (e.target.closest('#dsh-whale-toolbar')) return;
      if (Math.random() < 0.2) {
        triggerMeme();
      } else {
        triggerAction();
      }
    });

    // 工具栏事件绑定
    btnAction.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerAction();
    });

    btnMeme.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerMeme();
    });

    btnTalk.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = IDLE_DIALOGUES[Math.floor(Math.random() * IDLE_DIALOGUES.length)];
      showDialogue(msg);
    });

    btnHide.addEventListener('click', (e) => {
      e.stopPropagation();
      container.classList.add('pet-hidden');
      restoreBtn.style.display = 'flex';
      sessionStorage.setItem('dsh_whale_hidden', '1');
    });

    restoreBtn.addEventListener('click', () => {
      container.classList.remove('pet-hidden');
      restoreBtn.style.display = 'none';
      sessionStorage.removeItem('dsh_whale_hidden');
      showDialogue('我回来啦！继续陪主人看博客~✨', 3500);
    });

    // 检查是否有隐藏偏好
    if (sessionStorage.getItem('dsh_whale_hidden') === '1') {
      container.classList.add('pet-hidden');
      restoreBtn.style.display = 'flex';
    } else {
      // 首屏加载后 1.2 秒弹出欢迎问候
      setTimeout(() => {
        showDialogue(getWelcomeMessage(), 5000);
      }, 1200);
    }

    // 挂机日常碎碎念定时器 (每 45 秒有 40% 几率触发一条，其中有机会出表情包)
    setInterval(() => {
      if (container.classList.contains('pet-hidden')) return;
      if (!isInteracting && !dialogue.classList.contains('show') && Math.random() < 0.45) {
        if (Math.random() < 0.25) {
          triggerMeme();
        } else {
          const msg = IDLE_DIALOGUES[Math.floor(Math.random() * IDLE_DIALOGUES.length)];
          showDialogue(msg, 4000);
        }
      }
    }, 45000);

    // 异步预热常见动作动图与表情包缓存（避免首次切换有等待闪烁）
    setTimeout(() => {
      ACTIONS.slice(0, 6).forEach(a => {
        const pre = new Image();
        pre.src = CDN_BASE + a.file;
      });
      MEMES.slice(0, 4).forEach(m => {
        const pre = new Image();
        pre.src = MEME_CDN_BASE + encodeURIComponent(m.file);
      });
    }, 2500);
  }

  // 确保 DOM 准备完毕再挂载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPet);
  } else {
    initPet();
  }
})();

<template>
  <div class="home-container" :class="{'isToJietu': isToJietu}">
    <div class="tooltip-containter">
      <el-row v-if="!isToJietu">
        <el-col class="tooltip-item" :span="24">第 <el-input-number v-model="data.countNum" style="margin: 0 10px;" size="mini" /> 期</el-col>
        <el-col class="tooltip-item" :span="24">

          <el-collapse style="width: 100%">
            <el-collapse-item title="嘉宾分享" name="1">
              <el-tabs v-model="activeGuest" type="card" editable @edit="handleGuestTabs">
                <el-tab-pane
                  v-for="(item) in data.guest"
                  :key="item.ID"
                  :label="item.title.substring(0,5)"
                  :name="item.ID"
                >
                  <div class="tooltip-item"><span style="width: 60px">标题：</span><el-input v-model="item.title" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
                  <div class="tooltip-item"><span style="width: 60px">寄语：</span><el-input v-model="item.content1" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
                  <div class="tooltip-item"><span style="width: 60px">精选：</span><el-input v-model="item.content2" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
            <el-collapse-item title="推荐阅读" name="2">
              <el-tabs v-model="activeCommend" type="card" editable @edit="handleCommendTabs">
                <el-tab-pane
                  v-for="(item) in data.recommend"
                  :key="item.ID"
                  :label="item.title.substring(0,5)"
                  :name="item.ID"
                >
                  <div class="tooltip-item"><span style="width: 60px">标题：</span><el-input v-model="item.title" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
                  <div class="tooltip-item"><span style="width: 60px">理由：</span><el-input v-model="item.content" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
            <el-collapse-item title="周动态" name="3">

              <el-tag
                v-for="(dynItem,index) in data.dynamic"
                :key="index"
                class="tag-item"
                closable
                type="success"
                :disable-transitions="false"
                @close="handledynClose(dynItem)"
              >
                {{ dynItem.title }}
              </el-tag>
              <el-input
                v-if="dynInputVisible"
                ref="savedynTagInput"
                v-model="dynInputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handledynInputConfirm"
                @blur="handledynInputConfirm"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showdynInput">+ 添加</el-button>

            </el-collapse-item>
          </el-collapse>

        </el-col>
        <el-col class="tooltip-item" :span="24">
          <el-checkbox-group v-model="data.summary" size="mini">
            <el-checkbox label="招聘" />
            <el-checkbox label="红忠哥" />
            <el-checkbox label="张哥" />
          </el-checkbox-group>
        </el-col>
        <el-col class="tooltip-item" :span="24"><span style="width: 60px;font-size: 12px">二维码：</span><el-input v-model="data.codeImg" placeholder="请输入URL" style="margin: 0 10px;" size="mini" /></el-col>

      </el-row>

      <el-button :loading="btnloading" type="primary" size="mini" @click="downloadPoster2">导出海报图</el-button>
    </div>

    <div :style="{height: heightVal}" class="poster-containter">
      <div id="poster" ref="posterItem" class="poster-item" :class="{'isToJietu': isToJietu}">
        <div class="item-bgbox">
          <!-- <img style="position:absolute; top:0; width: 100%; opacity:.5;" :src="require(`@/assets/images/demo.png`)" alt=""> -->
          <img class="poster-background" :src="require(`@/assets/images/new-bg.jpg`)" alt="">
          <div class="poster-bgMore">
            <img class="bg-logo" :src="require(`@/assets/images/logo.png`)" alt="">
            <div class="bg-desc">
              <span class="desc-author">帅张和他的朋友们</span>
              <div class="desc-more">
                <span class="desc-count">26000</span>
                <span class="desc-single">+</span>
                <span class="desc-word">互联网球友聚集地</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item-containter">

          <div class="title-content">
            <div class="title-box">
              <span class="title-item">星球周报<span class="title-count">{{ data.countNum.toString().padStart(2, '0') }}</span>期</span>
            </div>
          </div>

          <div v-if="data.guest && data.guest.length > 0" class="content-box guest">

            <div class="content-title">
              <img :src="require(`@/assets/images/ic-left.png`)" alt="">
              <span class="title">嘉宾分享</span>
              <img :src="require(`@/assets/images/ic-right.png`)" alt="">
            </div>

            <div class="content">

              <div v-for="(recItem,index) in data.guest" :key="index" class="content-detail">
                <div class="item-title">{{ recItem.title }}</div>
                <div v-if="recItem.content1" class="item-sctitle"><span class="sctitle-detail">张哥寄语</span></div>
                <div v-if="recItem.content1" class="item-content" v-html="recItem.content1" />
                <div v-if="recItem.content2" class="item-sctitle"><span class="sctitle-detail">精彩速览</span></div>
                <div v-if="recItem.content2" class="item-content" v-html="recItem.content2" />
              </div>

            </div>

          </div>

          <div v-if="data.recommend && data.recommend.length > 0" class="content-box">

            <div class="content-title">
              <img :src="require(`@/assets/images/ic-left.png`)" alt="">
              <span class="title">推荐阅读</span>
              <img :src="require(`@/assets/images/ic-right.png`)" alt="">
            </div>

            <div class="content">

              <div v-for="(recItem,index) in data.recommend" :key="index" class="content-detail">
                <div class="item-title">{{ recItem.title }}</div>
                <div v-if="recItem.content" class="item-sctitle"><img class="deco" :src="require('@/assets/images/ic-zan.png')" alt=""><span class="sctitle-detail recommend-item-sctitle">上榜理由</span></div>
                <div v-if="recItem.content" class="item-content" v-html="recItem.content" />
              </div>

            </div>
          </div>

          <div v-if="data.dynamic && data.dynamic.length > 0" class="content-box">

            <div class="content-title">
              <img :src="require(`@/assets/images/ic-left.png`)" alt="">
              <span class="title">星球周动态</span>
              <img :src="require(`@/assets/images/ic-right.png`)" alt="">
            </div>
            <div class="content">

              <div class="content-detail content-all">
                <div v-for="(dynItem,index) in data.dynamic" :key="index" class="item-title">{{ dynItem.title }}</div>
              </div>

            </div>
          </div>

          <div v-if="data.summary && data.summary.length > 0" class="content-box">

            <div class="content-title">
              <img :src="require(`@/assets/images/ic-left.png`)" alt="">
              <span class="title">本周专栏汇总</span>
              <img :src="require(`@/assets/images/ic-right.png`)" alt="">
            </div>

            <div class="content">

              <div class="content-detail content-all">
                <div v-if="data.summary.includes('招聘')" class="item-title">@球友：<span class="white-word">本周招聘汇总</span></div>
                <div v-if="data.summary.includes('红忠哥')" class="item-title">@红忠哥耿律师：<span class="white-word">红忠哥律师动态汇总</span></div>
                <div v-if="data.summary.includes('张哥')" class="item-title">@stormzhang：<span class="white-word">张哥动态汇总</span></div>
              </div>

            </div>
          </div>

          <div class="footer">
            <div class="code-img"><img :src="data.codeImg" alt=""></div>
            <div class="share-containter">
              <div class="share-title">扫码查看详情</div>
            </div>
          </div>

        </div>

      </div>
    </div>
    <a v-if="!isToJietu" class="footer-link" target="_blank" href="https://beian.miit.gov.cn/">豫ICP备17035773号-1</a>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  name: 'Home',
  data() {
    return {
      heightVal: '100%',
      isToJietu: false,
      dynInputVisible: false,
      dynInputValue: '',
      activeCommend: '1',
      activeGuest: '1',
      tabIndexCommend: 2,
      tabIndexGuest: 2,
      index2: 2,
      index3: 3,
      index4: 4,
      data: {
        countNum: '07',
        guest: [
          // name: '十七',
          // title: '2.5w 粉丝，平均播放量 1w+ 的视频号分享',
          // content1: '今天，邀请了一位球友做关于视频号的分享，他从去年 7 月份开始研究视频号，现在粉丝量达到 2.5w+，单视频最大播放量 1700w+，视频平均播放量 1w+，做的非常牛逼。这位球友是 @<span class="author">十七</span>，文中他把自己做视频号的一些思考和心得体会分享出来，希望对也在做视频号的大家有帮助，也希望能给大家起到借鉴参考的意义。',
          // content2: '从一开始的视频封面和描述，到视频内容，到个人简介，再到评论区和底部公众号链接都要做好文案钩子，引导用户完成观看闭环。封面一定是你整个视频最精华的部分或者是你最能表达自己观点的一帧；视频内容就是文案 + 画面，埋悬念、讲故事、自问自答和旁白 4 种方法都适用；简介不用多说，简单明了，有产品的挂产品，再不济也要有一个微信号或公众号；评论区一定要设置自己的神评论，文案号的扎心评论、IP 号的引导评论，2 - 3 个微信号三个赞就置顶了，这样一套完整的闭环就形成了。'
        ],
        recommend: [
          // {
          //   name: 'SkyKai',
          //   title: '春招全面来袭，校招面试官来给你建议啦',
          //   content: '@SkyKai 作为去年的校招面试官，曾面试了不少同学，也包括很多 985 / 211 重点院校的学生。眼看新一轮的春招在即，这里他从面试官的角度提到了一些大家容易忽略的问题，大部分都是因为前期准备不充分所导致，这些问题其实很容易就能避免，处理得当还会在面试中加分。文章就面试前、面试中、面试后三个时间节点分别该做什么给出了中肯的建议。我们常说细节决定成败，影响你面试结果的可能就是一些最基础的东西，希望本文能对接下来需要参加面试的球友提供一些参考。'
          // },
          // {
          //   name: 'SkyKai',
          //   title: '春招全面来袭，校招面试官来给你建议啦',
          //   content: '@SkyKai 作为去年的校招面试官，曾面试了不少同学，也包括很多 985 / 211 重点院校的学生。眼看新一轮的春招在即，这里他从面试官的角度提到了一些大家容易忽略的问题，大部分都是因为前期准备不充分所导致，这些问题其实很容易就能避免，处理得当还会在面试中加分。文章就面试前、面试中、面试后三个时间节点分别该做什么给出了中肯的建议。我们常说细节决定成败，影响你面试结果的可能就是一些最基础的东西，希望本文能对接下来需要参加面试的球友提供一些参考。'
          // },
          // {
          //   name: 'SkyKai',
          //   title: '春招全面来袭，校招面试官来给你建议啦',
          //   content: '@SkyKai 作为去年的校招面试官，曾面试了不少同学，也包括很多 985 / 211 重点院校的学生。眼看新一轮的春招在即，这里他从面试官的角度提到了一些大家容易忽略的问题，大部分都是因为前期准备不充分所导致，这些问题其实很容易就能避免，处理得当还会在面试中加分。文章就面试前、面试中、面试后三个时间节点分别该做什么给出了中肯的建议。我们常说细节决定成败，影响你面试结果的可能就是一些最基础的东西，希望本文能对接下来需要参加面试的球友提供一些参考。'
          // }
        ],
        dynamic: [
          // {
          //   title: '2021 年 2 月人会员日来啦，主题：线下大会，你期待吗期待吗期待吗期待吗期待吗期待吗期待吗？'
          // },
          // {
          //   title: '2021 年 2 月会刚员日来啦，主题：线下大会，你期待吗期待吗期待吗期待吗期待吗期待吗期待吗？'
          // },
          // {
          //   title: '2021 年 2 月会刚发送员日来啦，主题：线下大会，你期待吗期待吗期待吗期待吗期待吗期待吗期待吗？'
          // }
        ],
        summary: ['招聘', '红忠哥', '张哥'],
        codeImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202007%2F13%2F20200713091444_ljjlq.thumb.400_0.webp&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617807206&t=f9fc11b387d39be540db3b8b82665ce9'
      },
      btnloading: false // 是否开始下载
    }
  },
  watch: {
    data: {
      handler: function(val) {
        const bol1 = !!(val.guest && val.guest.length > 0)
        const bol2 = !!(val.recommend && val.recommend.length > 0)
        const bol3 = !!(val.dynamic && val.dynamic.length > 0)
        const bol4 = !!(val.summary && val.summary.length > 0)
        if (bol1 && bol2) {
          this.index2 = 2
        } else {
          this.index2 = 1
        }
        if (bol1 && bol2 && bol3) {
          this.index3 = 3
        } else if ((bol1 && bol3) || (bol2 && bol3)) {
          this.index3 = 2
        } else {
          this.index3 = 1
        }
        if (bol1 && bol2 && bol3 && bol4) {
          this.index4 = 4
        } else if ((bol1 && bol2 && bol4) || (bol1 && bol3 && bol4) || (bol2 && bol3 && bol4)) {
          this.index4 = 3
        } else if ((bol1 && bol4) || (bol2 && bol4) || (bol3 && bol4)) {
          this.index4 = 2
        } else {
          this.index4 = 1
        }
      },
      deep: true
    }
  },
  methods: {
    showdynInput() {
      this.dynInputVisible = true
      this.$nextTick(_ => {
        this.$refs.savedynTagInput.$refs.input.focus()
      })
    },
    handledynInputConfirm() {
      const dynInputValue = this.dynInputValue
      if (dynInputValue) {
        this.data.dynamic.push({ title: this.dynInputValue })
      }
      this.dynInputVisible = false
      this.dynInputValue = ''
    },
    handledynClose(item) {
      this.data.dynamic = this.data.dynamic.filter(tab => tab.title !== item.title)
    },
    handleGuestTabs(targetName, action) {
      if (action === 'add') {
        const newTabName = ++this.tabIndexGuest + ''
        this.data.guest.push({
          title: newTabName,
          name: '',
          content: '',
          ID: newTabName
        })
        this.activeGuest = newTabName
      }
      if (action === 'remove') {
        const tabs = this.data.guest
        let activeName = this.activeGuest
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.ID === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.ID
              }
            }
          })
        }
        this.activeGuest = activeName
        this.data.guest = tabs.filter((tab) => tab.ID !== targetName)
      }
    },
    handleCommendTabs(targetName, action) {
      if (action === 'add') {
        const newTabName = ++this.tabIndexCommend + ''
        this.data.recommend.push({
          title: newTabName,
          name: '',
          content: '',
          ID: newTabName
        })
        this.activeCommend = newTabName
      }
      if (action === 'remove') {
        const tabs = this.data.recommend
        let activeName = this.activeCommend
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.ID === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.ID
              }
            }
          })
        }
        this.activeCommend = activeName
        this.data.recommend = tabs.filter((tab) => tab.ID !== targetName)
      }
    },

    downloadPoster2() {
      this.isToJietu = !this.isToJietu
      if (this.isToJietu) {
        this.heightVal = this.$refs.posterItem.offsetHeight * 2 + 'px'
      } else {
        this.heightVal = '100%'
      }
    },
    async downloadPoster() {
      this.btnloading = true

      const ele = document.getElementsByClassName('poster-item')[0]
      const scaleCanvas = document.createElement('canvas')
      const context = scaleCanvas.getContext('2d')
      const scale = 2
      const width = ele.clientWidth
      const height = ele.clientHeight

      scaleCanvas.width = width * scale
      scaleCanvas.height = height * scale
      context.scale(scale, scale)

      html2canvas(ele, {
        logging: false, // 日志开关，便于查看html2canvas的内部执行流程
        width, // dom 原始宽度
        height,
        scrollY: 0,
        scrollX: 0,
        scale,
        dpi: window.devicePixelRatio * 4,
        useCORS: true // 【重要】开启跨域配置
      }).then(canvas => {
        this.btnloading = false
        this.$message({ message: '下载成功', type: 'success' })
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')// 下载链接
        link.setAttribute('download', '周报.png')
        link.style.display = 'none'// a标签隐藏
        document.body.appendChild(link)
        link.click()
      }).catch(err => {
        this.btnloading = false
        this.$message({ message: '下载失败', type: 'error' })
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: siyuannormal;
  src: url('../../assets/font/siyuannormal.otf');
}
@font-face {
  font-family: siyuanbold;
  src: url('../../assets/font/siyuanbold.otf');
}

.home-container {
  &.isToJietu {
    flex-wrap: wrap;
  }
  margin: 10px;
  // background-color: #ccc;
  // height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
  .tooltip-containter {
    overflow-y: scroll;
    width: 820px;
  }
  .poster-containter {
    width: 50%;
    padding: 0 10px;
    display: flex;
    flex-wrap: wrap;
    // height: 100%;
    // overflow: scroll;
    min-width: 400px;
  }
}
@media screen and (max-width:800px) {
  .home-container {
    box-sizing: content-box;
    overflow: scroll;
    .tooltip-containter,
    .poster-containter {
      margin-bottom: 10px;
      width: 100%;
      box-sizing: content-box;
      height: auto;
      overflow: hidden;
    }
  }
}
.tooltip-containter {
  .tooltip-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  .tooltip-title {
    margin-top: 60px;
  }
  .tag-item {
    width: 100%;
    display: block;
    height: auto;
    white-space: normal;
    margin: 10px 0;
  }
}

.poster-item {
  margin: 0 auto;
  position: relative;
  width: 400px;
  background-color: #010e3f;
  overflow: hidden;
  &.isToJietu{
    transform: scale(2,2);
    transform-origin: top left;
  }
}
.item-bgbox {
  position: relative;
  .poster-background {
    width: 100%;
  }
  .poster-bgMore {
    position: absolute;
    top: 37px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bg-logo {
    // position: absolute;
    // left: 7%;
    margin-left: 7%;
    width: 11%;
  }
  .bg-desc {
    // position: absolute;
    // top: .8%;
    // right: -.5%;
    margin-right: -.5%;
    color: #fff;
    font-family: siyuanblod;
    font-size: 12px;
    // font-weight: 500;
    .desc-author {
      left: 5px;
      font-weight: 900;
      font-size: 13px;
      position: relative;
      transform: scale(1.02);
      background-image: -webkit-linear-gradient(top, #fff 0%,#fff 50%, #ddfceb 73%, #87fcbb 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    span {
      display: inline-block;
    }
    .desc-more {
      margin-top: 3%;
      .desc-count {
        // font-size: 9.5px;
        transform: scale(0.79);
        left: 1px;
        position: relative;
      }
      .desc-single {
        // font-size: 9px;
        transform: scale(.75);
      }
      .desc-word {
        transform: scale(.683);
        position: relative;
        left: -13px;
      }
    }
  }
}
.item-containter {
  margin-top: -100px;
  position: relative;
  z-index: 1;
  padding: 28px 22px;
  .iten-content {
    width: 100%;
    position: relative;
  }
}
.title-content {
  .title-box {
    font-size: 45px;
    margin-top: -2px;
    background-image: -webkit-linear-gradient(top, #fff 0%, #aadeff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title-item {
    width: 100%;
    text-align: center;
    font-family: siyuanblod;
    font-weight: 900;
  }
  .title-count {
    background-image: -webkit-linear-gradient(top, #fff 0%, #aadeff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: siyuanblod;
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
    font-weight: 900;
  }
}

.content-box {
  position: relative;
  margin-top: 20px;
  .content-title {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 1px;
    }
    .title {
      margin: 0 5px;
      font-weight: 900;
      color: #fff;
      font-size: 23px;
    }
  }
  .content-line {
    position: absolute;
  }
  .content {
    border: 1px solid rgba(255, 255, 255, .5);
    border-radius: 6px;
    padding: 10px;
    margin: 20px auto;
    position: relative;
  }
}
.guest .content .content-detail:nth-of-type(2) .item-title:first-child {
  margin-top: 12px;
}
.content {
  .content-detail {
    color: #fff;
    padding-left: 9px;
    padding-right: 9px;
    padding-bottom: 12px;
  }
  .content-detail:last-child  {
      padding-bottom: 5px;
  }
}
.content-detail {
  line-height: 20px;
  letter-spacing: 1px;
  .item-title {
    margin-left: -3px;
    font-family: siyuanbold;
    font-size: 16px;
    line-height: 25px;
    text-align: justify;
    font-weight: 900;
    background-image: -webkit-linear-gradient(top, #fff 0%, #aadeff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 6px;
    .white-word {
      font-weight: 500;
      color: #fff;
      background-image: -webkit-linear-gradient(top, #fff 0%, #fff 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  &.content-all .item-title:not(:first-child) {
    margin-top: 6px;
  }
  .item-sctitle {
    font-family: siyuanbold;
    margin-top: 16px;
    margin-bottom: 10px;
    position: relative;
  }
  .deco {
    width: 13px;
    margin-right: 10px;
    display: inline-block;
  }
  .sctitle-detail {
    text-align: justify;
    position: relative;
    z-index: 1;
    font-size: 14.8px;
    display: inline-block;
    margin-left: -3px;
    font-weight: 900;
    // mask-image: -webkit-gradient(linear, 0 top, 0 bottom, from(#fff), to(#aadeff));
    // -webkit-mask-image: -webkit-gradient(linear, 0 top, 0 bottom, from(#fff), to(#aadeff));
    background-image: -webkit-linear-gradient(top, #fff 0%, #aadeff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    &.recommend-item-sctitle {
      color: #fff;
      background-image: -webkit-linear-gradient(top, #fff 0%, #fff 100%);
    }
  }
  .item-content {
    font-family: siyuannormal;
    text-align: justify;
    font-size: 15px;
    color: #fff;
    margin-left: -3px;
    margin-top: -3px;
    line-height: 22px;
  }
}

.footer {
  margin: 45px auto 10px auto;
  padding: 0 15px;
  text-align: center;
  color: #fff;
  font-weight: bolder;
  font-family: siyuanbold;
  .code-img {
    margin: 0 auto;
    width: 110px;
    height: 110px;
    img {
      width: 110px;
      height: 110px;
    }
  }
  .share-title {
    margin-top: 10px;
    line-height: 25px;
    letter-spacing: 1px;
    font-size: 12px;
  }
}
.footer-link {
  position: absolute;
  bottom: 0;
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>

<style lang="scss">
.el-tabs__new-tab {
  color: #000;
  border-color: #000;
}
.el-tabs__item {
  height: 30px;
  line-height: 30px;
}
.el-tabs__new-tab {
  margin-top: 9px;
}
</style>

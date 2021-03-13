<template>
  <div class="home-container">
    <div class="tooltip-containter">
      <el-row>
        <el-col class="tooltip-item" :span="24">第 <el-input-number v-model="data.countNum" style="margin: 0 10px;" size="mini" /> 期</el-col>
        <el-col class="tooltip-item" :span="24">

          <el-collapse style="width: 100%">
            <el-collapse-item title="嘉宾分享" name="1">
              <div class="tooltip-item"><span style="width: 60px">嘉宾名：</span><el-input v-model="data.guest.name" style="width: 200px; flex: 1" size="mini" /></div>
              <div class="tooltip-item"><span style="width: 60px">标题：</span><el-input v-model="data.guest.title" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
              <div class="tooltip-item"><span style="width: 60px">寄语：</span><el-input v-model="data.guest.content1" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
              <div class="tooltip-item"><span style="width: 60px">精选：</span><el-input v-model="data.guest.content2" style="width: 200px; flex: 1" type="textarea" size="mini" /></div>
            </el-collapse-item>
            <el-collapse-item title="推荐阅读" name="2">
              <el-tabs v-model="activeCommend" type="card" editable @edit="handleCommendTabs">
                <el-tab-pane
                  v-for="(item) in data.recommend"
                  :key="item.ID"
                  :label="item.title.substring(0,5)"
                  :name="item.ID"
                >
                  <div class="tooltip-item"><span style="width: 60px">名字：</span><el-input v-model="item.name" style="width: 200px; flex: 1" size="mini" /></div>
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

      <el-button :loading="btnloading" type="primary" size="mini" @click="downloadPoster">导出海报图</el-button>
    </div>

    <div class="poster-containter">
      <div class="poster-item">

        <div class="item-containter">

          <div class="title-content">
            <div class="title-box">
              <span class="title-item title-top">帅张和他的朋友们</span>
              <span class="title-item">星球周报<span class="title-count">{{ data.countNum.toString().padStart(2, '0') }}</span>期</span>
            </div>
          </div>

          <div v-if="data.guest && data.guest.name" class="content-box">
            <div class="content-line line-left" />
            <div class="content-line line-right" />
            <div class="content-line line-top" />
            <div class="content-line line-bottom" />

            <div class="content">

              <div class="content-title">
                <div class="title-num">
                  <span class="title">01</span>
                </div>
                <div class="title-name">
                  嘉宾分享
                </div>
              </div>

              <div class="content-detail">
                <div class="item-title">@<span class="author">{{ data.guest.name }}</span>：{{ data.guest.title }}</div>
                <div class="item-sctitle"><span class="sctitle-detail">张哥寄语</span><span class="deco" /></div>
                <div class="item-content" v-html="data.guest.content1" />
                <div class="item-sctitle"><span class="sctitle-detail">精彩速览</span><span class="deco" /></div>
                <div class="item-content" v-html="data.guest.content2" />
              </div>

            </div>

          </div>

          <div v-if="data.recommend && data.recommend.length > 0" class="content-box">
            <div class="content-line line-left" />
            <div class="content-line line-right" />
            <div class="content-line line-top" />
            <div class="content-line line-bottom" />
            <div class="content">

              <div class="content-title">
                <div class="title-num">
                  <span class="title">{{ index2.toString().padStart(2, '0') }}</span>
                </div>
                <div class="title-name">
                  推荐阅读
                </div>
              </div>

              <div v-for="(recItem,index) in data.recommend" :key="index" class="content-detail">
                <div class="item-title">@<span class="author">{{ recItem.name }}</span>：{{ recItem.title }}</div>
                <div class="item-sctitle"><span class="sctitle-detail">上榜理由</span><span class="deco" /></div>
                <div class="item-content" v-html="recItem.content" />
              </div>

            </div>
          </div>

          <div v-if="data.dynamic && data.dynamic.length > 0" class="content-box">
            <div class="content-line line-left" />
            <div class="content-line line-right" />
            <div class="content-line line-top" />
            <div class="content-line line-bottom" />
            <div class="content">

              <div class="content-title">
                <div class="title-num">
                  <span class="title">{{ index3.toString().padStart(2, '0') }}</span>
                </div>
                <div class="title-name">
                  星球周动态
                </div>
              </div>

              <div class="content-detail content-all">
                <div v-for="(dynItem,index) in data.dynamic" :key="index" class="item-title">{{ dynItem.title }}</div>
              </div>

            </div>
          </div>

          <div v-if="data.summary && data.summary.length > 0" class="content-box">
            <div class="content-line line-left" />
            <div class="content-line line-right" />
            <div class="content-line line-top" />
            <div class="content-line line-bottom" />

            <div class="content">

              <div class="content-title">
                <div class="title-num">
                  <span class="title">{{ index4.toString().padStart(2, '0') }}</span>
                </div>
                <div class="title-name">
                  本周专栏汇总
                </div>
              </div>

              <div class="content-detail content-all">
                <div v-if="data.summary.includes('招聘')" class="item-title">@<span class="author">球友</span>：本周招聘汇总</div>
                <div v-if="data.summary.includes('红忠哥')" class="item-title">@<span class="author">红忠哥耿律师</span>：红忠哥律师动态汇总</div>
                <div v-if="data.summary.includes('张哥')" class="item-title">@<span class="author">stormzhang</span>：张哥动态汇总</div>
              </div>

            </div>
          </div>

          <div class="footer">
            <div class="code-img"><img :src="data.codeImg" alt=""></div>
            <div class="share-containter">
              <div class="share-title">扫描左侧二维码查看完整内容</div>
              <div class="share-line" />
              <div class="share-desc">@<span class="author">帅张和他的朋友们</span> {{ data.countNum.toString().padStart(2, '0') }} 期周报</div>
              <div class="share-desc">— 星球内容运营组「周报小分队」整理</div>
            </div>
          </div>

        </div>

        <img class="poster-background" :src="require(`@/assets/images/bg.jpg`)" alt="" srcset="">
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  name: 'Home',
  data() {
    return {
      dynInputVisible: false,
      dynInputValue: '',
      activeCommend: '1',
      tabIndex: 2,
      index2: 2,
      index3: 3,
      index4: 4,
      data: {
        countNum: '07',
        guest: {
          // name: '十七',
          // title: '2.5w 粉丝，平均播放量 1w+ 的视频号分享',
          // content1: '今天，邀请了一位球友做关于视频号的分享，他从去年 7 月份开始研究视频号，现在粉丝量达到 2.5w+，单视频最大播放量 1700w+，视频平均播放量 1w+，做的非常牛逼。这位球友是 @<span class="author">十七</span>，文中他把自己做视频号的一些思考和心得体会分享出来，希望对也在做视频号的大家有帮助，也希望能给大家起到借鉴参考的意义。',
          // content2: '从一开始的视频封面和描述，到视频内容，到个人简介，再到评论区和底部公众号链接都要做好文案钩子，引导用户完成观看闭环。封面一定是你整个视频最精华的部分或者是你最能表达自己观点的一帧；视频内容就是文案 + 画面，埋悬念、讲故事、自问自答和旁白 4 种方法都适用；简介不用多说，简单明了，有产品的挂产品，再不济也要有一个微信号或公众号；评论区一定要设置自己的神评论，文案号的扎心评论、IP 号的引导评论，2 - 3 个微信号三个赞就置顶了，这样一套完整的闭环就形成了。'
        },
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
        const bol1 = !!(val.guest && val.guest.name)
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
    handleCommendTabs(targetName, action) {
      if (action === 'add') {
        const newTabName = ++this.tabIndex + ''
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
  font-family: huxiaobo;
  src: url('../../assets/font/huxiaobo.otf');
}
@font-face {
  font-family: siyuannormal;
  src: url('../../assets/font/siyuannormal.otf');
}
@font-face {
  font-family: siyuanbold;
  src: url('../../assets/font/siyuanbold.otf');
}

.home-container {
  margin: 10px;
  // background-color: #ccc;
  height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
  .tooltip-containter {
    overflow-y: scroll;
    width: 50%;
  }
  .poster-containter {
    width: 50%;
    padding: 0 10px;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    overflow: scroll;
    min-width: 400px;
  }
}
@media screen and (max-width:800px) {
  .home-container {
    box-sizing: content-box;
    flex-wrap: wrap;
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
  background-color: #69ad7c;
  overflow: hidden;
}
.item-containter {
  position: relative;
  z-index: 1;
  padding: 28px;
  .iten-content {
    width: 100%;
    position: relative;
  }
}
.poster-background {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.title-content {
  .title-box {
    font-size: 28px;
    color: #ffbd4a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 12px;
    margin-bottom: 20px;
  }
  .title-top {
    margin-bottom: 5px;
  }
  .title-item {
    width: 100%;
    font-weight: bold;
    text-align: center;
    letter-spacing: 1px;
    font-family: huxiaobo;
  }
  .title-count {
    font-family: huxiaobo;
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
  }
}

.content-box {
  background-color: #fff;
  border-radius: 4px;
  position: relative;
  .content-line {
    position: absolute;
    // opacity: .1;
    border: 0.5px solid rgba(105, 173, 124, .1);
  }
  .content {
    padding: 10px;
    margin-bottom: 40px;
    position: relative;
  }
}
.content-line {
  &.line-left {
    left: 10px;
    width: 0;
    height: 100%;
  }
  &.line-right {
    right: 10px;
    width: 0;
    height: 100%;
  }
  &.line-top {
    top: 10px;
    width: 100%;
    height: 0;
  }
  &.line-bottom {
    bottom: 10px;
    width: 100%;
    height: 0;
  }
}
.content {
  .content-title {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 6px;
    margin-left: -16px;
  }
  .content-detail {
    padding-left: 9px;
    padding-right: 9px;
    padding-bottom: 10px;
  }
}
.content-title {
  .title-num {
    width: 47px;
    height: 24px;
    background-image: linear-gradient(90deg, #f8cd61 0%, #fbb968 100%);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  .title-name {
    font-family: siyuanbold;
    font-weight: bold;
    margin-top: 2px;
  }
}
.title-num .title {
  color: #fff;
  font-weight: bold;
  margin-left: -2px;
  font-family: siyuanbold;
}

.content .content-detail:nth-of-type(2) .item-title:first-child {
  margin-top: 20px;
  color: red;
}
.content-detail {
  line-height: 20px;
  letter-spacing: 1px;
  .item-title {
    font-family: siyuanbold;
    font-size: 12px;
    margin-top: 10px;
  }
  &.content-all .item-title:not(:first-child) {
    margin-top: 6px;
  }
  .author {
    color: #ffbd4a;
    font-weight: bold;
  }
  .item-sctitle {
    font-family: siyuanbold;
    font-size: 11px;
    margin-top: 15px;
    margin-bottom: 10px;
    position: relative;
  }
  .deco {
    background-color: #ffbd4a;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    left: -4px;
    top: -1px;
    position: absolute;
    z-index: 0;
  }
  .sctitle-detail {
    position: relative;
    z-index: 1;
  }
  .item-content {
    font-size: 11px;
    font-family: siyuannormal;
  }
}

.footer {
  margin: 40px auto 20px auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer {
  color: #fff;
  font-weight: bolder;
  font-family: siyuanbold;
  .code-img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    img {
      width: 80px;
      height: 80px;
    }
  }
  .share-title {
    line-height: 25px;
    letter-spacing: 1px;
    font-size: 16px;
  }
  .share-line {
    margin-bottom: 4px;
    width: 100%;
    height: 0;
    border: 1px solid #fff;
  }
  .share-desc {
    line-height: 20px;
    font-size: 13px;
  }
  .author {
    color: #ffbd4a;
  }
}

</style>

<style lang="scss">
.content-detail {
  .author {
    color: #ffbd4a;
    font-weight: bold;
  }
}
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

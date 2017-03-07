Page({
    data: {
        navbarArray: [{
            text: '推荐',
            type: 'navbar-item-active'
        }, {
            text: '热点',
            type: ''
        }, {
            text: '视频',
            type: ''
        }, {
            text: '图片',
            type: ''
        }, {
            text: '段子',
            type: ''
        }, {
            text: '社会',
            type: ''
        }, {
            text: '娱乐',
            type: ''
        }, {
            text: '科技',
            type: ''
        }, {
            text: '体育',
            type: ''
        }, {
            text: '汽车',
            type: ''
        }, {
            text: '财经',
            type: ''
        }, {
            text: '搞笑',
            type: ''
        }],
        navbarShowIndexArray: Array.from(Array(12).keys()),
        navbarHideIndexArray: [],
        windowWidth: 375,
        scrollNavbarLeft: 0,
        currentChannelIndex: 0,
        startTouchs: {
            x: 0,
            y: 0
        },
        channelSettingShow: '',
        channelSettingModalShow: '',
        channelSettingModalHide: true,
        articlesHide: false,
        articleContent: '',
        loadingModalHide: false,
        temporaryArray:  Array.from(new Array(9), (val, index) => index + 1)
    },
    onLoad: function() {
        const that = this;

        let navbarShowIndexArrayData = wx.getStorageSync('navbarShowIndexArray');
        if (navbarShowIndexArrayData) {
            that.setData({
                navbarShowIndexArray: navbarShowIndexArrayData
            });
        } else {
            that.storeNavbarShowIndexArray();
        }

        that.getArticles(0);

        wx.getSystemInfo({
            success: (res) => {
                that.setData({
                    windowWidth: res.windowWidth
                });
            }
        });

        let navbarArray = that.data.navbarArray;
        let navbarShowIndexArray = that.data.navbarShowIndexArray;
        let navbarHideIndexArray = [];
        navbarArray.forEach((item, index, array) => {
            if (-1 === navbarShowIndexArray.indexOf(index)) {
                navbarHideIndexArray.push(index);
            }
        });
        that.setData({
            navbarHideIndexArray: navbarHideIndexArray
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onTapNavbar: function(e) {
        this.switchChannel(parseInt(e.currentTarget.id));
    },
    switchChannel: function(targetChannelIndex) {
        this.getArticles(targetChannelIndex);

        let navbarArray = this.data.navbarArray;
        navbarArray.forEach((item, index, array) => {
            item.type = '';
            if (index === targetChannelIndex) {
                item.type = 'navbar-item-active';
            }
        });
        this.setData({
            navbarArray: navbarArray,
            currentChannelIndex: targetChannelIndex
        });
    },
    getArticles: function(index) {
        const that = this;
        that.setData({
            loadingModalHide: false,
            articleContent: ''
        });
        setTimeout(() => {
            that.setData({
                loadingModalHide: true,
                articleContent: that.data.navbarArray[index].text
            });
        }, 500);
    },
    onTouchstartArticles: function(e) {
        this.setData({
            'startTouchs.x': e.changedTouches[0].clientX,
            'startTouchs.y': e.changedTouches[0].clientY
        });
    },
    onTouchendArticles: function(e) {
        let deltaX = e.changedTouches[0].clientX - this.data.startTouchs.x;
        let deltaY = e.changedTouches[0].clientY - this.data.startTouchs.y;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            let deltaNavbarIndex = deltaX > 0 ? -1 : 1;
            let currentChannelIndex = this.data.currentChannelIndex;
            let navbarShowIndexArray = this.data.navbarShowIndexArray;
            let targetChannelIndexOfNavbarShowIndexArray = navbarShowIndexArray.indexOf(currentChannelIndex) + deltaNavbarIndex;
            let navbarShowIndexArrayLength = navbarShowIndexArray.length;
            if (targetChannelIndexOfNavbarShowIndexArray >= 0 && targetChannelIndexOfNavbarShowIndexArray <= navbarShowIndexArrayLength - 1) {
                let targetChannelIndex = navbarShowIndexArray[targetChannelIndexOfNavbarShowIndexArray];
                if (navbarShowIndexArrayLength > 6) {
                    let scrollNavbarLeft;
                    if (targetChannelIndexOfNavbarShowIndexArray < 5) {
                        scrollNavbarLeft = 0;
                    } else if (targetChannelIndexOfNavbarShowIndexArray === navbarShowIndexArrayLength - 1) {
                        scrollNavbarLeft = this.rpx2px(110 * (navbarShowIndexArrayLength - 6));
                    } else {
                        scrollNavbarLeft = this.rpx2px(110 * (targetChannelIndexOfNavbarShowIndexArray - 4));
                    }
                    this.setData({
                        scrollNavbarLeft: scrollNavbarLeft
                    });
                }
                this.switchChannel(targetChannelIndex);
            }
        }
    },
    rpx2px: function(rpx) {
        return this.data.windowWidth * rpx / 750;
    },
    showChannelSettingModal: function() {
        const that = this;
        that.setData({
            channelSettingShow: 'channel-setting-show',
            articlesHide: true,
            channelSettingModalHide: false
        });
        setTimeout(() => {
            that.setData({
                channelSettingModalShow: 'channel-setting-modal-show'
            });
        }, 50);
    },
    hideChannelSettingModal: function() {
        const that = this;

        that.resetNavbar();

        that.setData({
            channelSettingShow: '',
            channelSettingModalShow: ''
        });
        setTimeout(() => {
            that.setData({
                channelSettingModalHide: true,
                articlesHide: false
            });
            that.getArticles(0);
        }, 500);
    },
    hideChannel: function(e) {
        let navbarShowIndexArray = this.data.navbarShowIndexArray;
        let navbarHideIndexArray = this.data.navbarHideIndexArray;
        navbarHideIndexArray.push(navbarShowIndexArray.splice(navbarShowIndexArray.indexOf(parseInt(e.currentTarget.id)), 1)[0]);
        this.setData({
            navbarShowIndexArray: navbarShowIndexArray,
            navbarHideIndexArray: navbarHideIndexArray
        });
        this.storeNavbarShowIndexArray();
    },
    upChannel: function(e) {
        let navbarShowIndexArray = this.data.navbarShowIndexArray;
        let index = navbarShowIndexArray.indexOf(parseInt(e.currentTarget.id));
        let temp = navbarShowIndexArray[index];
        navbarShowIndexArray[index] = navbarShowIndexArray[index - 1];
        navbarShowIndexArray[index - 1] = temp;
        this.setData({
            navbarShowIndexArray: navbarShowIndexArray
        });
        this.storeNavbarShowIndexArray();
    },
    showChannel: function(e) {
        let navbarShowIndexArray = this.data.navbarShowIndexArray;
        let navbarHideIndexArray = this.data.navbarHideIndexArray;
        navbarShowIndexArray.push(navbarHideIndexArray.splice(navbarHideIndexArray.indexOf(parseInt(e.currentTarget.id)), 1)[0]);
        this.setData({
            navbarShowIndexArray: navbarShowIndexArray,
            navbarHideIndexArray: navbarHideIndexArray
        });
        this.storeNavbarShowIndexArray();
    },
    storeNavbarShowIndexArray: function() {
        const that = this;
        wx.setStorage({
            key: 'navbarShowIndexArray',
            data: that.data.navbarShowIndexArray
        });
    },
    resetNavbar: function() {
        let navbarArray = this.data.navbarArray;
        navbarArray.forEach((item, index, array) => {
            item.type = '';
            if (0 === index) {
                item.type = 'navbar-item-active';
            }
        });
        this.setData({
            navbarArray: navbarArray,
            scrollNavbarLeft: 0
        });
    }
})

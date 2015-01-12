LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_WHOLE_STATIC_LIBRARIES += jsb_pluginx_static

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

LOCAL_SRC_FILES := hellojavascript/main.cpp \
                   ../../Classes/AppDelegate.cpp 

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes

LOCAL_STATIC_LIBRARIES := cocos_jsb_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)


$(call import-module,bindings)
$(call import-module,cocos2d-x/plugin/jsbindings)
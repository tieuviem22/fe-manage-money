import { notification } from 'ant-design-vue';
import { IconType } from 'ant-design-vue/lib/notification';

export function openNotificationWithIcon(type: IconType, title: string, content: string){
    notification[type]({
        message: title,
        description: content
    });
};
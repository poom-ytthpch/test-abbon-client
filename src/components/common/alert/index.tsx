import { notification } from "antd";
import { ArgsProps } from "antd/lib/notification";

export function alertSuccess(
  message: ArgsProps["description"],
  title?: ArgsProps["message"]
) {
  notification.success({
    message: title ?? "Success",
    description: message,
    // duration: 0,
  });
}

export function alertError(
  message: ArgsProps["description"],
  title?: ArgsProps["message"],
  duration = 0
) {
  notification.error({
    message: title ?? "Error",
    description: message,
    duration,
  });
}

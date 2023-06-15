# condition_variable

## .notify_one()

对等待的进程进行通知

## .notify_all()

## .wait(std::mutex x,[]()->bool{}))

当函数返回flase时，线程挂起，mutex x解锁，直到.notify_one()的通知重新判断
当函数返回true时，继续持有锁

## condition_variable_any

有灵活的硬件需求时选用
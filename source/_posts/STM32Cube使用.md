---
title: STM32CubeMX 完整使用指南：从项目创建到代码生成
date: 2021-5-27 18:00:00
index_img: https://pic1.imgdb.cn/item/68cb6992c5157e1a88142d2e.png
category: 嵌入式开发
tags:
  - STM32
  - STM32CubeMX
  - 嵌入式
  - 单片机
  - HAL库
  - 硬件开发
math: false
mermaid: true
# sticky: 1 # 置顶
---

> STM32CubeMX 是意法半导体（STMicroelectronics）提供的一款强大的图形化配置工具，能够极大简化 STM32 微控制器的初始化代码生成。本文将从安装配置到实际项目开发，全面介绍 STM32CubeMX 的使用方法和最佳实践。

<!-- more -->

## 项目背景

在 STM32 嵌入式开发过程中，传统的手工配置寄存器和初始化代码的方式不仅耗时耗力，而且容易出错。STM32CubeMX 作为一款图形化初始代码生成器，极大简化了工程建立和配置的时间消耗。

### 主要使用场景

本人主要在以下场景中使用 STM32CubeMX：

1. **模块测试**：当主工程比较复杂，某个模块出现 BUG 时，首先检测模块的驱动和模块本身是否有问题
2. **独立调试**：如果在主工程中未能找到问题，就将模块独立出来，用 STM32CubeMX 建立新工程单独测试
3. **资料查阅**：翻阅芯片的信息和文档，非常方便

{% note info %}
建议初学者使用 STM32CubeMX 来快速入门，熟练后再逐步深入学习底层原理。
{% endnote %}



# 2. 安装相关软件

- [STM32cubemx](https://www.st.com/zh/development-tools/stm32cubemx.html)：其中有三个版本，linux，mac和win，根据自己系统下载即可。官网下载需要登录，未登录点下载时让你填写邮箱别乱写，他要发验证过去，不会让你直接下载的 - -|

- 安装java，直接去[官网](https://www.java.com/zh-CN/)下载，安装的时候勾选配置环境变量即可。

- 我用的window，STM32cubemx下载文件里面就一个exe，直接安装，安装过程中没啥要注意的。

- 打开STM32CubeMX，它会自动更新，建议架”梯子”，不然很慢，和KEIL那个更新一样。在菜单栏help->Updater Settings可以进行配置.

  ![img](https://blog.kala.love/posts/d7c953b6/p_1.png)

- 在help->Embedded software packages Manager中下载对应芯片的软件包

  ![img](https://blog.kala.love/posts/d7c953b6/p_2.png)

# 3. 创建工程

## 3.1 创建

- 菜单栏file->new project[![img](https://blog.kala.love/posts/d7c953b6/p_3.png)](https://blog.kala.love/posts/d7c953b6/p_3.png) 这里能方面的查看芯片的信息和相关文档！

## 3.2 时钟配置

这里根据自己硬件来设置，我使用的是8M外部无源晶振。
打开左侧System Core标签下的RCC来配置高速\低速时钟的模式

- Crystal/Ceramic Resonator 外部晶体/陶瓷谐振器模式(无源晶振选这个)
- BYPASS clock source 外部时钟源旁路模式(有源晶振选这个)[![img](https://blog.kala.love/posts/d7c953b6/p_4.png)](https://blog.kala.love/posts/d7c953b6/p_4.png)

然后点击菜单栏的Clock Configuration配置时钟树。

[![img](https://blog.kala.love/posts/d7c953b6/p_5.png)](https://blog.kala.love/posts/d7c953b6/p_5.png)

## 3.3 调试配置

不进行配置是无法使用调试功能的，也可以选择SW等，会初始化对应的引脚。

[![img](https://blog.kala.love/posts/d7c953b6/p_6.png)](https://blog.kala.love/posts/d7c953b6/p_6.png)

## 3.4 GPIO配置

在界面右侧的芯片引脚图中可以直接点击来配置所需要的引脚模式

[![img](https://blog.kala.love/posts/d7c953b6/p_7.png)](https://blog.kala.love/posts/d7c953b6/p_7.png)

然后在左侧菜单栏选择GPIO可以进行详细设置

[![img](https://blog.kala.love/posts/d7c953b6/p_8.png)](https://blog.kala.love/posts/d7c953b6/p_8.png)

## 3.5 USART配置

在界面左侧选择Connectivity->USART,然后设置模式为异步通信（Asynchronous）,下面是串口配置，可以默认。

[![img](https://blog.kala.love/posts/d7c953b6/p_11.png)](https://blog.kala.love/posts/d7c953b6/p_11.png)

然后点击NVIC Settings勾选中断

[![img](https://blog.kala.love/posts/d7c953b6/p_12.png)](https://blog.kala.love/posts/d7c953b6/p_12.png)

## 3.6 IIC配置

- 开启IIC，参数可默认[![img](https://blog.kala.love/posts/d7c953b6/p_13.png)](https://blog.kala.love/posts/d7c953b6/p_13.png)
- 将GPIO设置成无需上下拉，依靠外部电路即可[![img](https://blog.kala.love/posts/d7c953b6/p_14.png)](https://blog.kala.love/posts/d7c953b6/p_14.png)
- 关于生成代码，主要在i2c.c中，该工程已经将IIC初始化相关操作完成，我们要做的仅仅是进行设备的读写了而已。这里简单说明一下自动生成的代码。
  他首先在工程中添加了stm32l1xx_hal_i2c.c，这便是我们调用的驱动库，然后在stm32l1xx_hal_conf.h中打开了宏#define HAL_I2C_MODULE_ENABLED，至此在算将IIC库引入了进来。
  接下来便是通过驱动库来初始化IIC，i2c.c中的HAL_I2C_MspInit和HAL_I2C_MspDeInit是对引脚的初始化和反初始化，但是不需要我们来调用，他在库中被弱实现，在使用库函数HAL_I2C_Init来初始化的时候，内部将会调用此函数来进行引脚初始化，所以这里仅仅是来实现这个函数而已。实际在主函数调用的IIC初始化函数是MX_I2C1_Init，他是根据在cube中的配置信息来初始化IIC的。

## 3.7 PWM配置

- 选择PA2为PWM的通道[![img](https://blog.kala.love/posts/d7c953b6/p_15.png)](https://blog.kala.love/posts/d7c953b6/p_15.png)
- 配置对于的时钟TIM2，选择通道3[![img](https://blog.kala.love/posts/d7c953b6/p_16.png)](https://blog.kala.love/posts/d7c953b6/p_16.png)
- 配置该PWM通道，系统时钟32M(这里是由于换了芯片L151是32M的)[![img](https://blog.kala.love/posts/d7c953b6/p_17.png)](https://blog.kala.love/posts/d7c953b6/p_17.png)

# 4. 生成代码

上侧菜单栏选择Project Manager，然后对工程进行配置

[![img](https://blog.kala.love/posts/d7c953b6/p_9.png)](https://blog.kala.love/posts/d7c953b6/p_9.png) [![img](https://blog.kala.love/posts/d7c953b6/p_10.png)](https://blog.kala.love/posts/d7c953b6/p_10.png)

最后点击右上角的GENERATE CODE，至此便完成了工程的建立

# 5. keil工程

## 5.1 环境

- 下载jlink驱动：[官网](https://www.segger.com/downloads/jlink/)，点开J-Link Software and Documentation Pack标签，按需下载。
- 下载KEIL：[官网](https://www2.keil.com/mdk5/)

## 5.1 GPIO例程

例程根据上列3.4配置生成

- 图形化的引脚配置被生成在了gpio.c文件中

- stm32f1xx_hal_msp.c包含使用的库函数初始化了反初始化

- stm32f1xx_it.c包含中断函数接口

- system_stm32f1xx.c里面主要是配置了时钟

- main.c中全部配置工作都已经完成，只需要在main函数中编写应用代码即可，例如不断切换引脚电平

  ```
  int main(void)
  {
    /* USER CODE BEGIN 1 */
    /* USER CODE END 1 */
    /* MCU Configuration--------------------------------------------------------*/
    /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
    HAL_Init();
    /* USER CODE BEGIN Init */
    /* USER CODE END Init */
    /* Configure the system clock */
    SystemClock_Config();
    /* USER CODE BEGIN SysInit */
    /* USER CODE END SysInit */
    /* Initialize all configured peripherals */
    MX_GPIO_Init();
    /* USER CODE BEGIN 2 */
    /* USER CODE END 2 */
    /* Infinite loop */
    /* USER CODE BEGIN WHILE */
    while (1)
    {
      /* USER CODE END WHILE */
      HAL_GPIO_WritePin(GPIOD, GPIO_PIN_6, GPIO_PIN_RESET);
      HAL_Delay(1000);
      HAL_GPIO_WritePin(GPIOD, GPIO_PIN_6, GPIO_PIN_SET);
      HAL_Delay(1000);
      /* USER CODE BEGIN 3 */
    }
    /* USER CODE END 3 */
  }
  ```

## 5.2 USART例程

### 5.2.1 添加printf映射

```
#include <stdio.h>
int fputc(int ch, FILE *f)
{
  HAL_UART_Transmit(&huart1, (uint8_t *)&ch, 1, 0xffff);
  return ch;
}
int fgetc(FILE *f)
{
  uint8_t ch = 0;
  HAL_UART_Receive(&huart1, &ch, 1, 0xffff);
  return ch;
}
```

### 5.2.2 发送

串口发送实际上是将逐个字节扔到一个8位寄存器中去，然后以起始位+数据位+奇偶校验位+停止位组成一帧数据进行发送。

- 发送函数，在规定时间进行发送，未能发送成功则返回HAL_TIMEOUT

  ```
  HAL_UART_Transmit(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout)
  HAL_UART_Transmit(&huart1,txBuffer,10,0xffff);
  ```

- 串口中断发送，使能发送中断后，在中断中进行逐个数据的发送，发送完成后调用回调函数。

  ```
  HAL_StatusTypeDef HAL_UART_Transmit_IT(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size)
  HAL_UART_Transmit_IT(&huart1,txBuffer,10);
  void HAL_UART_TxCpltCallback(UART_HandleTypeDef *huart)
  {
  	 if(huart == &huart1)
  	 {
  		   flag++;
  	 }
  }
  ```

### 5.2.3 接收

- 阻塞接收，在规定时间内程序阻塞在此等待接收规定的数据个数

  ```
  HAL_StatusTypeDef HAL_UART_Receive(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout)
  HAL_UART_Receive(&huart1,rxBuffer,3,5000);
  ```

- 中断接收，在需要接收的位置启动HAL_UART_Receive_IT，数据接收完毕后将触发接收完成中断HAL_UART_RxCpltCallback

  ```
  HAL_UART_Receive_IT(&huart1, rxBuffer, 1);
  void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
  {
  	 if(huart == &huart1)
  	 {
  		  recvDataNumber++;
  		  HAL_UART_Receive_IT(huart, rxBuffer, 1);
  	 }
  }
  ```

## 5.3 IIC例程

测试程序-HTU21D温湿度
以下列举库中我们可能用到的库函数，取至库函数抬头的注释

```
(#) Blocking mode functions are :
    (++) HAL_I2C_Master_Transmit()
    (++) HAL_I2C_Master_Receive()
    (++) HAL_I2C_Slave_Transmit()
    (++) HAL_I2C_Slave_Receive()
    (++) HAL_I2C_Mem_Write()
    (++) HAL_I2C_Mem_Read()
    (++) HAL_I2C_IsDeviceReady()
    
(#) No-Blocking mode functions with Interrupt are :
    (++) HAL_I2C_Master_Transmit_IT()
    (++) HAL_I2C_Master_Receive_IT()
    (++) HAL_I2C_Slave_Transmit_IT()
    (++) HAL_I2C_Slave_Receive_IT()
    (++) HAL_I2C_Master_Sequential_Transmit_IT()
    (++) HAL_I2C_Master_Sequential_Receive_IT()
    (++) HAL_I2C_Slave_Sequential_Transmit_IT()
    (++) HAL_I2C_Slave_Sequential_Receive_IT()
    (++) HAL_I2C_Mem_Write_IT()
    (++) HAL_I2C_Mem_Read_IT()

(#) No-Blocking mode functions with DMA are :
    (++) HAL_I2C_Master_Transmit_DMA()
    (++) HAL_I2C_Master_Receive_DMA()
    (++) HAL_I2C_Slave_Transmit_DMA()
    (++) HAL_I2C_Slave_Receive_DMA()
    (++) HAL_I2C_Mem_Write_DMA()
    (++) HAL_I2C_Mem_Read_DMA()

(#) A set of Transfer Complete Callbacks are provided in non Blocking mode:
    (++) HAL_I2C_MemTxCpltCallback()
    (++) HAL_I2C_MemRxCpltCallback()
    (++) HAL_I2C_MasterTxCpltCallback()
    (++) HAL_I2C_MasterRxCpltCallback()
    (++) HAL_I2C_SlaveTxCpltCallback()
    (++) HAL_I2C_SlaveRxCpltCallback()
    (++) HAL_I2C_ErrorCallback()
    (++) HAL_I2C_AbortCpltCallback()
```

编写两个函数，一个发送命令使其复位传感器，一个读温度数据
前者的命令格式是地址+命令，所以使用了HAL_I2C_Master_Transmit，通信成功了就返回0

```
int htu21d_soft_reset()
{
	  uint8_t val = 0xFE;
	  if(HAL_I2C_Master_Transmit(&hi2c1,0X80,&val,1,100) == HAL_OK)
		{
		    return 0;
		}			
		else
		{
		   return 1;
		}
}
```

这里补充一下，IIC设备非常多，很多传感器说明文档的地址表述方式不一样，使其有的需要自己移位来得到实际填入地址，有的着不需要。当然你可以自己仔细看文档，然后再追踪代码看库函数的具体实现，得到自己应该填写的地址，这里库函数仅仅是补上了读写位。 还有一种比较暴力的方法，但是挺好用的，那就是轮询地址。反正一般地址就0到FF间，一个循环，几秒钟的找出来了。
例如上列修改成

```
uint8_t i;
uint8_t val =0xfe;
for(i=0;i<0xff;i++)
{
    if(HAL_I2C_Master_Transmit(&hi2c1,i,&val,1,100) == HAL_OK)
   {
        printf("%02X\n",i);
   }
}
```

然后就会看到在0X80和0X81的被打印出来，一个读一个写。

然后时读温度函数，这里需要用的具体寄存器地址所以需要使用HAL_I2C_Mem_Read函数

```
uint16_t htu21d_get_temp()
{
    uint16_t temp=0;
	  float temp_f=0;
	  uint8_t buff[2];
	  
	  if(HAL_I2C_Mem_Read(&hi2c1,0X81,0XE3,I2C_MEMADD_SIZE_8BIT,buff,2,100) == HAL_OK)
		{
		    uint16_t ret = (buff[0] << 8) | (buff[1] & 0xfc);	
			  temp_f = ret*175.72/65536-46.85;		
		    temp = (uint16_t)(temp_f*10.0);
		}
		else
		{
		   temp=0;
		}
	  return temp;
}
```

## 5.4 PWM代码

主函数中初始化了GPIO和TIM，前者仅仅打开了GPIO的时钟，主要初始化在TIM中。

```
//main.h
  MX_GPIO_Init();
  MX_TIM2_Init();
```

在tim.c则进行了对于通道引脚初始化和定时器PWM初始化

```
//初始化PA2对于定时器TIM2的CH3
void HAL_TIM_MspPostInit(TIM_HandleTypeDef* timHandle)
{

  GPIO_InitTypeDef GPIO_InitStruct = {0};
  if(timHandle->Instance==TIM2)
  {
    __HAL_RCC_GPIOA_CLK_ENABLE();
    GPIO_InitStruct.Pin = GPIO_PIN_2;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM2;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
  }
}
```

定时器初始化的时候将进行时钟配置，这决定了PWM的频率，Prescaler表示分频数，表示如果最终分频到TIM的时钟是32M，那么实际使用时钟则是32/Prescaler。Period代表定时器计数达到多少后重新装填，对于PWM来说就代表了一个周期，所以PWM的频率就等于48M/Prescaler/Period。Pulse就对应占空比了，他代表当前计数，占空比 = Pulse/Period

```
void MX_TIM2_Init(void)
{
  TIM_MasterConfigTypeDef sMasterConfig = {0};
  TIM_OC_InitTypeDef sConfigOC = {0};

  htim2.Instance = TIM2;
  htim2.Init.Prescaler = 32-1;//分频
  htim2.Init.CounterMode = TIM_COUNTERMODE_UP;//向上计数
  htim2.Init.Period = 1000-1;//阈值
  htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  if (HAL_TIM_PWM_Init(&htim2) != HAL_OK)
  {
    Error_Handler();
  }
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  if (HAL_TIMEx_MasterConfigSynchronization(&htim2, &sMasterConfig) != HAL_OK)
  {
    Error_Handler();
  }
  sConfigOC.OCMode = TIM_OCMODE_PWM1;
  sConfigOC.Pulse = 0;//PWM初始计数值  0/1000
  sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
  sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
  if (HAL_TIM_PWM_ConfigChannel(&htim2, &sConfigOC, TIM_CHANNEL_3) != HAL_OK)
  {
    Error_Handler();
  }
  HAL_TIM_MspPostInit(&htim2);

}
```

之后的启动和占空比修改就需要自己调用stm32l1xx_hal.time.c中的函数来执行了

| 函数                                                         | 说明              |
| ------------------------------------------------------------ | ----------------- |
| HAL_StatusTypeDef HAL_TIM_PWM_Start(TIM_HandleTypeDef *htim, uint32_t Channel) | 启动对应通道的PWM |
| HAL_StatusTypeDef HAL_TIM_PWM_Stop(TIM_HandleTypeDef *htim, uint32_t Channel) | 停止对应通道的PWM |

| 宏                                                          | 说明               |
| ----------------------------------------------------------- | ------------------ |
| __HAL_TIM_SET_COMPARE(**HANDLE**, **CHANNEL**, **COMPARE**) | 配置对于通道占空比 |

下面是在tim.c中添加的函数

```
void USR_TIM_PWM_OpenTim2Ch3()
{
	HAL_TIM_PWM_Start(&htim2,TIM_CHANNEL_3);
}

void USR_TIM_PWM_CloseTim2Ch3()
{
  HAL_TIM_PWM_Stop(&htim2,TIM_CHANNEL_3);
}

//duty == 0~1000
void USR_TIM_PWM_SetCompare(uint16_t duty)
{
   if(duty >1000) //这里1000是因为计数阈值被设置成了1千
	 {
		  duty=1000;
	 }
	 __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_3, duty);
   
}
```

最后在主函数中调用进行测试
先添加打印定向，使其能够printf输出

```
#include "stdio.h"
#ifdef __GNUC__
#define PUTCHAR_PROTOTYPE int __io_putchar(int ch)
#else
#define PUTCHAR_PROTOTYPE int fputc(int ch, FILE *f)
#endif /* __GNUC__ */
PUTCHAR_PROTOTYPE
{
	HAL_UART_Transmit(&huart1 , (uint8_t *)&ch, 1, 0xFFFF);
	return ch;
}
```

然后启动PWM，设置占空比50%

```
 USR_TIM_PWM_OpenTim2Ch3();
USR_TIM_PWM_SetCompare(500); //50%
```

- STM32L系列定时器通道对应关系

| 引脚号 | 定时器通道   |
| ------ | ------------ |
| PA0    | TIM2_CH1_ETR |
| PA1    | TIM2_CH2     |
| PA2    | TIM2_CH3     |
| PA3    | TIM2_CH4     |
| PA6    | TIM3_CH1     |
| PA7    | TIM3_CH2     |
| PB0    | TIM3_CH3     |
| PB1    | TIM3_CH4     |
| PB6    | TIM4_CH1     |
| PB7    | TIM4_CH2     |
| PB8    | TIM4_CH3     |
| PB9    | TIM4_CH4     |

## 开发技巧与最佳实践

### 🛠️ 开发建议

#### 1. 项目管理
- **版本控制**：建议使用 Git 管理 STM32CubeMX 项目文件（.ioc 文件）
- **备份策略**：定期备份项目配置，避免意外丢失
- **命名规范**：使用有意义的项目名称和引脚标签

#### 2. 配置优化
- **时钟配置**：优先使用外部晶振，确保时钟稳定性
- **功耗管理**：合理配置低功耗模式，延长电池寿命
- **中断优先级**：根据实际需求设置合理的中断优先级

#### 3. 代码生成
- **用户代码保护**：始终在 `/* USER CODE BEGIN */` 和 `/* USER CODE END */` 之间编写代码
- **HAL 库使用**：熟悉 HAL 库函数的使用方法和返回值处理
- **错误处理**：添加完善的错误处理机制

### ⚠️ 常见问题与解决方案

#### 时钟配置问题
```c
// 检查时钟配置是否正确
if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
{
  Error_Handler();
}
```

#### GPIO 配置冲突
{% note warning %}
注意避免引脚功能冲突，STM32CubeMX 会提供冲突检测，但仍需仔细检查。
{% endnote %}

#### 调试器连接问题
- 确保正确配置调试接口（SWD/JTAG）
- 检查调试器驱动是否正确安装
- 验证硬件连接是否正确

## 总结

STM32CubeMX 作为 STM32 开发生态系统的重要组成部分，为嵌入式开发者提供了强大的图形化配置工具。通过本文的详细介绍，您应该能够：

### 🎯 核心收获

- ✅ **快速上手**：掌握 STM32CubeMX 的基本使用方法
- ✅ **配置精通**：熟练配置各种外设和功能模块
- ✅ **代码生成**：理解 HAL 库代码的生成和使用
- ✅ **调试技能**：具备基本的问题排查和解决能力

### 📈 学习建议

1. **循序渐进**：从简单的 GPIO 控制开始，逐步学习复杂外设
2. **实践为主**：多动手实践，结合实际项目需求
3. **文档阅读**：养成查阅官方文档和数据手册的习惯
4. **社区交流**：积极参与技术论坛和开源项目

### 🚀 进阶方向

- **RTOS 集成**：学习 FreeRTOS 在 STM32CubeMX 中的配置
- **高级外设**：深入学习 DMA、ADC、DAC 等高级功能
- **低功耗设计**：掌握 STM32 的低功耗特性和优化技巧
- **无线通信**：探索 LoRa、WiFi、蓝牙等无线通信模块

{% note success %}
**经验分享**：STM32CubeMX 是一个非常实用的工具，但不应完全依赖它。建议在熟练使用 CubeMX 的同时，也要深入学习 STM32 的底层原理，这样才能在遇到复杂问题时游刃有余。
{% endnote %}

## 相关资源

### 📚 官方资源
- [STM32CubeMX 官方网站](https://www.st.com/zh/development-tools/stm32cubemx.html)
- [STM32 HAL 库文档](https://www.st.com/resource/en/user_manual/um1718-stm32cubel1-hal-and-lowlayer-drivers-stmicroelectronics.pdf)
- [STM32 数据手册](https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html)

### 🛠️ 开发工具
- [Keil MDK](https://www2.keil.com/mdk5/)
- [STM32CubeIDE](https://www.st.com/en/development-tools/stm32cubeide.html)
- [J-Link 调试器](https://www.segger.com/products/debug-probes/j-link/)

### 💡 学习资源
- [STM32 中文社区](https://www.stmcu.org.cn/)
- [正点原子教程](http://www.alientek.com/)
- [野火电子教程](https://doc.embedfire.com/)

---

*希望这篇 STM32CubeMX 使用指南能够帮助您快速掌握这一强大的开发工具。如果您有任何问题或建议，欢迎在评论区交流讨论！*



---
title: SAA 複習：RDS Proxy 解決什麼問題
description: Lambda 大量連線把 RDS 塞爆時，RDS Proxy 的連線池、Failover 與密碼管理三個好處，附一題英文考題的拆解。
date: 2026-11-05
category: AWS
tags: [SAA, RDS, Lambda]
---

準備 AWS SAA-C03 的複習筆記。這篇用一個情境把 RDS Proxy 從頭推一遍。

## 問題：1000 個 Lambda 同時連 RDS

把 RDS 想成一間餐廳，**座位數是固定的**（`max_connections`，小機型大約幾十到幾百）。Lambda 每次被觸發都會自己開一條新連線，用完就關。

1000 個 Lambda 同時湧進來，最先撐不住的不是 CPU，而是**連線數被用光**。座位滿了，後面的請求直接收到 `too many connections`，就算 CPU 還很閒也一樣。

## 好處一：連線池（Connection Pooling）

不換大餐廳的話，就在門口放一個帶位員，讓客人排隊共用座位。這就是 RDS Proxy。

| | 沒有 Proxy | 有 RDS Proxy |
|---|---|---|
| 誰連 DB | 每個 Lambda 各開一條 | Proxy 維持少量連線，大家輪流共用 |
| 結果 | 座位被搶光，報錯 | DB 只看到少量連線，負擔穩定 |

考題看到「Lambda + RDS + too many connections」，答案幾乎都是 RDS Proxy。

## 好處二：Failover 更快

Multi-AZ 的主 DB 掛掉時會切到備用 DB。沒有 Proxy，應用程式要自己發現斷線、重新連線。

有 Proxy 時，應用程式從頭到尾只連 **Proxy 的 endpoint**，由 Proxy 去連新的主 DB，客人頂多覺得上菜慢了一點。考試關鍵字：**Failover 時間最多縮短 66%**。

## 好處三：程式碼裡不放密碼

```
Lambda（IAM Role）→ IAM 驗證 → RDS Proxy → 從 Secrets Manager 取密碼 → RDS
```

- DB 密碼放在 **Secrets Manager**，由 Proxy 去拿，Lambda 碰不到。
- Lambda 用自己的 **IAM Role** 向 Proxy 證明身分。

另外要記得：RDS Proxy **只能在 VPC 內使用，不能從外網連**。

## 考題拆解

> A company runs a serverless application in which AWS Lambda functions query an Amazon RDS for MySQL DB instance. During traffic spikes, the application fails with "too many connections" errors. The security team also requires that database credentials must not be stored in the Lambda function code or environment variables.
> Which solution meets these requirements with the LEAST operational overhead?
>
> A. Increase the DB instance size to raise max_connections, and store the credentials in Lambda environment variables encrypted with AWS KMS.
> B. Create an RDS Proxy that uses credentials stored in AWS Secrets Manager, and enable IAM authentication for the Lambda functions.
> C. Add a Read Replica and distribute queries across the primary instance and the replica.
> D. Place an Amazon SQS queue between the Lambda functions and the DB instance to buffer the requests.

**一句話說這題在問什麼**：連線太多把應用程式弄掛，而且密碼不能放在程式碼或環境變數裡，要怎麼解？注意 *"also requires"*，這題有**兩個條件**。

答案是 **B**。錯的選項各錯在哪：

- **A**：換大機型確實能拉高連線上限，但密碼還是放在環境變數。用 KMS 加密聽起來很安全，**加密過的環境變數還是環境變數**。
- **C**：Read Replica 只能處理讀取，寫入一樣會把主庫塞爆；密碼問題也沒處理。
- **D**：SQS 是非同步的，適合「先收下、晚點處理」的工作（寄信、轉檔）。查詢是使用者在等結果，**同步的請求不能丟進佇列緩衝**。而且架構要大改，不符合 *LEAST operational overhead*，密碼問題也沒解決。

## 我的弱點

SQS 的使用情境我已經錯第三次了。判斷方式：**呼叫的一方需不需要馬上拿到結果？** 需要的話就不是 SQS。

# Prompt Examples

Use these examples to recognize when this skill should activate and what kind of response the user likely wants.

## Search

- 幫我找台灣政府開放資料裡跟空氣品質有關的資料集
- 找新北市交通相關而且有 JSON 格式的資料
- 我想找可以分析房價的政府資料集，先給我候選名單

## Single Dataset Summary

- 幫我整理這個資料集的重點：`A41000000G-000001`
- 這份資料集有哪些下載格式與下載連結？
- 這個資料集多久更新一次、由誰提供？

## Comparison

- 比較這三份資料集哪個比較適合做交通分析
- 我有兩份候選資料集，幫我看哪份更新比較穩定
- 這幾份資料的格式和提供方式有什麼差異？

## Inventory

- 列出最近 7 天有異動的交通資料集
- 幫我整理某個機關目前公開的所有資料集
- 給我一份某主題的資料集盤點清單，附更新時間和格式

## Download and Access Links

- 幫我找這份資料真正的 CSV 下載連結
- 這個資料集有沒有 API 或 access URL？
- 這份資料底下所有 resource 的格式與網址都列給我

## Out-of-Scope Examples

These should not be handled as schema-validation tasks:

- 驗證某個欄位值符不符合政府資料標準
- 幫我找這個欄位對應的 schema URI
- 檢查這份 CSV 是否符合 `schema.gov.tw` 的欄位規格

For these requests, this skill should either narrow the scope back to `data.gov.tw` metadata work or tell the user that schema validation is outside this skill's scope.

/*
 * Brevo API
 *
 * Brevo provide a RESTFul API that can be used with any languages. With this API, you will be able to :   - Manage your campaigns and get the statistics   - Manage your contacts   - Send transactional Emails and SMS   - and much more...  You can download our wrappers at https://github.com/orgs/brevo  **Possible responses**   | Code | Message |   | :-------------: | ------------- |   | 200  | OK. Successful Request  |   | 201  | OK. Successful Creation |   | 202  | OK. Request accepted |   | 204  | OK. Successful Update/Deletion  |   | 400  | Error. Bad Request  |   | 401  | Error. Authentication Needed  |   | 402  | Error. Not enough credit, plan upgrade needed  |   | 403  | Error. Permission denied  |   | 404  | Error. Object does not exist |   | 405  | Error. Method not allowed  |   | 406  | Error. Not Acceptable  |
 *
 * API version: 3.0.0
 * Contact: contact@brevo.com
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */

package lib

type CreateUpdateProduct struct {
	// Product ID for which you requested the details
	Id string `json:"id"`
	// Mandatory in case of creation**. Name of the product for which you requested the details
	Name string `json:"name"`
	// URL to the product
	Url string `json:"url,omitempty"`
	// Absolute URL to the cover image of the product
	ImageUrl string `json:"imageUrl,omitempty"`
	// Product identifier from the shop
	Sku string `json:"sku,omitempty"`
	// Price of the product
	Price float32 `json:"price,omitempty"`
	// Category ID-s of the product
	Categories []string `json:"categories,omitempty"`
	// Parent product id of the product
	ParentId string `json:"parentId,omitempty"`
	// Meta data of product such as description, vendor, producer, stock level. The size of cumulative metaInfo shall not exceed **1000 KB**. Maximum length of metaInfo object can be 10.
	MetaInfo map[string]string `json:"metaInfo,omitempty"`
	// Facilitate to update the existing category in the same request (updateEnabled = true)
	UpdateEnabled bool `json:"updateEnabled,omitempty"`
	// UTC date-time (YYYY-MM-DDTHH:mm:ss.SSSZ) of the product deleted from the shop's database
	DeletedAt string `json:"deletedAt,omitempty"`
}

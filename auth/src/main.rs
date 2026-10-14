// src/main.rs

use don_core::{DonServer, axum::Router, DonHooks}; 
use don_macros::DonModel;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, don_core::sqlx::FromRow, DonModel)]
pub struct Product {
    pub id: i32, 
    pub name: String,
    pub price: i32
    
}


impl DonHooks for Product {}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let api_routes = Router::new()
        .nest("/api/products", Product::get_api_routes());

    DonServer::new()
        .port(8080)
        .with_routes(api_routes) 
        .start()
        .await
        .expect("Server crashed!");
}
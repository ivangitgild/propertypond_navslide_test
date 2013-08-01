


var formData = {
    statusData : [
        
        {title:'Active', value:1},
        {title:'Under Contract', value: 3},
        {title:'Withdrawn', value: 4},
        {title:'Off Market', value: 5},
        {title:'Expired', value: 6},
        {title:'Sold', value: 8},
        {title:'Any', value:-1}
    ],
    typeData : [
        {title:'Any', value:-1},
        {title:'Single Family', value:1},
        {title:'Condo', value: 2},
        {title:'Twin', value: 4},
        {title:'Townhouse', value: 8},
        {title:'Mobile (w/o Land)', value: 16},
        {title:'Recreational', value: 32}
    ],
    classData : [
        {title:'Residential', value:'Residential'},
        {title:'Land', value: 'Land'},
        {title:'Multi Unit', value: 'MultiUnit'},
        {title:'Commercial', value: 'Commercial'},
        {title:'Farm', value: 'Farm'}
    ],
    priceData : [
        [
            {title:'No Min', value: -1},
            {title:'$100,000', value: 100000},
            {title:'$125,000', value: 125000},
            {title:'$150,000', value: 150000},
            {title:'$175,000', value: 175000},
            {title:'$200,000', value: 200000},
            {title:'$250,000', value: 250000},
            {title:'$300,000', value: 300000},
            {title:'$350,000', value: 350000},
            {title:'$400,000', value: 400000},
            {title:'$450,000', value: 450000},
            {title:'$500,000', value: 500000},
            {title:'$550,000', value: 550000},
            {title:'$600,000', value: 600000},
            {title:'$650,000', value: 650000},
            {title:'$700,000', value: 700000},
            {title:'$750,000', value: 750000},
            {title:'$800,000', value: 800000},
            {title:'$850,000', value: 850000},
            {title:'$900,000', value: 900000},
            {title:'$950,000', value: 950000},
            {title:'$1,000,000', value: 1000000},
            {title:'$1,100,000', value: 1100000},
            {title:'$1,200,000', value: 1200000},
            {title:'$1,300,000', value: 1300000},
            {title:'$1,400,000', value: 1400000},
            {title:'$1,500,000', value: 1500000},
            {title:'$1,600,000', value: 1600000},
            {title:'$1,700,000', value: 1700000},
            {title:'$1,800,000', value: 1800000},
            {title:'$1,900,000', value: 1900000},
            {title:'$2,000,000', value: 2000000},
            {title:'$2,500,000', value: 2500000},
            {title:'$3,000,000', value: 3000000},
            {title:'$3,500,000', value: 3500000},
            {title:'$4,000,000', value: 4000000},
            {title:'$4,500,000', value: 4500000},
            {title:'$5,000,000+', value: 5000000}
        ],
        [
            {title:'No Max', value: -1},
            {title:'$100,000', value: 100000},
            {title:'$125,000', value: 125000},
            {title:'$150,000', value: 150000},
            {title:'$175,000', value: 175000},
            {title:'$200,000', value: 200000},
            {title:'$250,000', value: 250000},
            {title:'$300,000', value: 300000},
            {title:'$350,000', value: 350000},
            {title:'$400,000', value: 400000},
            {title:'$450,000', value: 450000},
            {title:'$500,000', value: 500000},
            {title:'$550,000', value: 550000},
            {title:'$600,000', value: 600000},
            {title:'$650,000', value: 650000},
            {title:'$700,000', value: 700000},
            {title:'$750,000', value: 750000},
            {title:'$800,000', value: 800000},
            {title:'$850,000', value: 850000},
            {title:'$900,000', value: 900000},
            {title:'$950,000', value: 950000},
            {title:'$1,000,000', value: 1000000},
            {title:'$1,100,000', value: 1100000},
            {title:'$1,200,000', value: 1200000},
            {title:'$1,300,000', value: 1300000},
            {title:'$1,400,000', value: 1400000},
            {title:'$1,500,000', value: 1500000},
            {title:'$1,600,000', value: 1600000},
            {title:'$1,700,000', value: 1700000},
            {title:'$1,800,000', value: 1800000},
            {title:'$1,900,000', value: 1900000},
            {title:'$2,000,000', value: 2000000},
            {title:'$2,500,000', value: 2500000},
            {title:'$3,000,000', value: 3000000},
            {title:'$3,500,000', value: 3500000},
            {title:'$4,000,000', value: 4000000},
            {title:'$4,500,000', value: 4500000},
            {title:'$5,000,000+', value: 5000000}
        ]
    ],
    bedData : [
        {title:'Any', value:-1},
        {title:'2+ Beds', value:2},
        {title:'3+ Beds', value:3},
        {title:'4+ Beds', value:4},
        {title:'5+ Beds', value:5},
        {title:'6+ Beds', value:6},
        {title:'8+ Beds', value:8},
        {title:'10+ Beds', value:10}
    ],
    bathData : [
        {title:'Any', value:-1},
        {title:'2+ Baths', value:2},
        {title:'3+ Baths', value:3},
        {title:'4+ Baths', value:4},
        {title:'5+ Baths', value:5}
    ],
    lotSizeData : [
        {title:'Any', value:-1},
        {title:'.10+ Acres', value:.1},
        {title:'.20+ Acres', value:.2},
        {title:'.25+ Acres', value:.25},
        {title:'.33+ Acres', value:.33},
        {title:'.50+ Acres', value:.5},
        {title:'.75+ Acres', value:.75},
        {title:'1+ Acres', value:1},
        {title:'2+ Acres', value:2},
        {title:'5+ Acres', value:5},
        {title:'10+ Acres', value:10}
    ],
    sqftData : [
        {title:'Any', value:-1},
        {title:'250+ SF', value:250},
        {title:'500+ SF', value:500},
        {title:'1,000+ SF', value:1000},
        {title:'1,500+ SF', value:1500},
        {title:'2,000+ SF', value:2000},
        {title:'2,500+ SF', value:2500},
        {title:'3,000+ SF', value:3000},
        {title:'4,000+ SF', value:4000},
        {title:'5,000+ SF', value:5000},
        {title:'7,500+ SF', value:7500},
        {title:'10000+ SF', value:10000}
    ],
    ageOfHomeData : [
        {title:'Any', value:-1},
        {title:'0-5 Years Old', value:5},
        {title:'0-10 Years Old', value:10},
        {title:'0-20 Years Old', value:20},
        {title:'0-50 Years Old', value:50},
        {title:'Over 50 Years Old', value:'Over'}
    ],
    landTypeData : [
        {title:'Any', value:-1},
        {title:'Residential', value:512},
        {title:'Commercial', value: 1024},
        {title:'Industrial', value: 2048},
        {title:'Recreational', value: 4096},
        {title:'Agricultural', value: 8192},
        {title:'Multi Housing', value: 16384},
        {title:'OTher', value: 32768}
    ],
    commercialTypeData : [
        {title:'Any', value:-1},
        {title:'Business + R.E.', value:65536},
        {title:'Business Only', value: 131072},
        {title:'Retail', value: 262144},
        {title:'Hotel/Motel', value: 524288},
        {title:'Industrial', value: 1048576},
        {title:'Office', values: 2097152},
        {title:'Warehouse', value: 4194304},
        {title:'Investment', value: 8388608},
        {title:'Restaurant', value: 16777216}
    ],
    multiUnitData : [
        {title:'Any', value:-1},
        {title:'Duplex', value:64},
        {title:'Triplex', value: 128},
        {title:'Fourplex', value: 256},
        {title:'> 4 Units', value: 512}    
    ],
    multiUnitGarage : [
        {title:'Any', value:-1},
        {title:'1+', value:1},
        {title:'2+', value: 2},
        {title:'3+', value: 3},
        {title:'4+', value: 4} 
    ],
    multiUnitStyle : [
        {title:'Any', value:-1},
        {title:'Other/See Remarks', value:1},
        {title:'1 - Story', value: 2},
        {title:'2 - Story', value: 4},
        {title:'3 - Story', value: 8},
        {title:'5-Plex', value: 16},
        {title:'Front And Rear', values: 32},
        {title:'High Rise', value: 64},
        {title:'Side By Side', value: 128},
        {title:'Studio Apt', value: 256},
        {title:'Up And Down', value: 512}
    ],
    radius : [
        {title:'1 Mile', value:1},
        {title:'2 Miles', value:2},
        {title:'3 Miles', value:3},
        {title:'4 Miles', value:4},        
        {title:'5 Miles', value:5},
        {title:'10 Miles', value:10}
    ]
}



module.exports = formData;

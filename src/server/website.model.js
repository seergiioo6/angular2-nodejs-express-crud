var mongoose = require('mongoose');

var websiteSchema = mongoose.Schema({
    name: String,
    format: String,
    impressions: Number,
    clicks: Number,
    ctr: Number,
    ecpm: Number,
    earning: Number,
    date: Date

});

var Website = mongoose.model('Website', websiteSchema);

module.exports = Website;
var _hasFeatureAccess = function (name) {
    var fetchXmlParts = ["<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>",
        "<entity name='cds_mst_feature_flag'>",
            "<attribute name='cds_mst_feature_flagid' />",
            "<attribute name='cds_name' />",
            "<attribute name='createdon' />",
            "<order attribute='cds_name' descending='false' />",
            "<link-entity name='cds_feature_access' from='cds_feature_flagid' to='cds_mst_feature_flagid' link-type='outer' alias='ah'>",
                "<filter type='and'>",
                    "<condition attribute='ownerid' operator='eq-useroruserteams' />",
                "</filter>",
            "</link-entity>",
            "<filter type='and'>",
                "<condition attribute='statecode' operator='eq' value='0' />",
                "<condition attribute='cds_name' operator='eq' value='" + name + "' />",
                "<filter type='or'>",
                    "<condition attribute='cds_owner_access_required' operator='eq' value='0' />",
                    "<condition entityname='ah' attribute='cds_feature_accessid' operator='not-null' />",
                "</filter>",
            "</filter>",
        "</entity>",
    "</fetch>",];

    var fetchXml = fetchXmlParts.join('');
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
   
    var hasAccess = false;
    Xrm.WebApi.retrieveMultipleRecords("cds_mst_feature_flag", fetchXml).then(
        function success(result)
        {
            result.entities.forEach(function (f)
            {
                if (f.cds_name == name)
                {
                    hasAccess = true;
                    break;
                }
            })
        },
        function (error)
        {
            console.log(error.message);
        }
    );
    return hasAccess;
}